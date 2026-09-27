import { NextRequest, NextResponse } from "next/server";
import { formatEther, parseWalletAddress } from "@/lib/address";
import { alchemyUrl, getChain, isChainId } from "@/lib/chains";
import { getCached, rateLimit, setCached } from "@/lib/rate-limit";

const PAGE_SIZE = "0x3e8";
const MAX_PAGES = 4;
const MAX_SHOWN = 800;

export type Transaction = {
  hash: string;
  from: string;
  to: string;
  value: string;
  asset: string;
  category: string;
  uniqueId: string;
  time: string;
};

export type WalletPayload = {
  address: string;
  balance: string;
  balanceUsd: number | null;
  tokenPrice: number | null;
  priceUnavailable: boolean;
  transactions: Transaction[];
  historyTruncated: boolean;
  chain: {
    id: string;
    name: string;
    symbol: string;
    explorer: string;
  };
};

type AlchemyTransfer = {
  uniqueId?: string;
  hash: string;
  from: string;
  to: string | null;
  value: number | null;
  asset?: string | null;
  category?: string;
  metadata?: { blockTimestamp?: string };
};

async function readJson(response: Response) {
  if (!response.ok) {
    throw new Error(`Upstream ${response.status}`);
  }
  return response.json();
}

async function getTokenPrice(coingeckoId: string): Promise<number | null> {
  const cacheKey = `price:${coingeckoId}`;
  const cached = getCached<number>(cacheKey);
  if (cached != null) return cached;

  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
    { next: { revalidate: 60 } }
  );
  if (!response.ok) return null;
  const data = await response.json();
  const price = data?.[coingeckoId]?.usd;
  if (typeof price !== "number") return null;
  setCached(cacheKey, price, 60_000);
  return price;
}

async function getBalance(address: string, url: string): Promise<string> {
  const data = await readJson(
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [address, "latest"],
      }),
    })
  );
  if (data.error) throw new Error(data.error.message ?? "Balance lookup failed");
  return formatEther(BigInt(data.result));
}

async function alchemyTransfers(
  address: string,
  url: string,
  direction: "from" | "to",
  category: string[]
): Promise<{ transfers: AlchemyTransfer[]; truncated: boolean }> {
  const transfers: AlchemyTransfer[] = [];
  let pageKey: string | undefined;
  let truncated = false;

  try {
    for (let page = 0; page < MAX_PAGES; page += 1) {
      const params: Record<string, unknown> = {
        fromBlock: "0x0",
        toBlock: "latest",
        category,
        maxCount: PAGE_SIZE,
        order: "desc",
        withMetadata: true,
        excludeZeroValue: false,
      };
      if (direction === "from") params.fromAddress = address;
      else params.toAddress = address;
      if (pageKey) params.pageKey = pageKey;

      const data = await readJson(
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "alchemy_getAssetTransfers",
            params: [params],
          }),
        })
      );
      if (data.error) break;
      transfers.push(...((data.result?.transfers ?? []) as AlchemyTransfer[]));
      pageKey = data.result?.pageKey as string | undefined;
      if (!pageKey) return { transfers, truncated: false };
    }
    truncated = Boolean(pageKey);
  } catch {
    return { transfers, truncated };
  }

  return { transfers, truncated };
}

async function getTransfers(address: string, url: string) {
  const [inNative, outNative, inToken, outToken] = await Promise.all([
    alchemyTransfers(address, url, "to", ["external", "internal"]),
    alchemyTransfers(address, url, "from", ["external", "internal"]),
    alchemyTransfers(address, url, "to", ["erc20"]),
    alchemyTransfers(address, url, "from", ["erc20"]),
  ]);
  return {
    transfers: [
      ...inNative.transfers,
      ...outNative.transfers,
      ...inToken.transfers,
      ...outToken.transfers,
    ],
    truncated:
      inNative.truncated ||
      outNative.truncated ||
      inToken.truncated ||
      outToken.truncated,
  };
}

function mapTransfers(transfers: AlchemyTransfer[], fallbackSymbol: string): Transaction[] {
  const seen = new Set<string>();
  const mapped: Transaction[] = [];

  for (const transfer of transfers) {
    if (!transfer.hash) continue;
    const uniqueId =
      transfer.uniqueId ||
      `${transfer.hash}:${transfer.category}:${transfer.from}:${transfer.to}:${transfer.asset}`;
    if (seen.has(uniqueId)) continue;
    seen.add(uniqueId);
    mapped.push({
      hash: transfer.hash,
      from: transfer.from,
      to: transfer.to || "Contract Creation",
      value: transfer.value == null ? "0" : String(transfer.value),
      asset: transfer.asset || fallbackSymbol,
      category: transfer.category || "external",
      uniqueId,
      time: transfer.metadata?.blockTimestamp || "",
    });
  }

  return mapped.sort((a, b) => {
    const ta = a.time ? new Date(a.time).getTime() : 0;
    const tb = b.time ? new Date(b.time).getTime() : 0;
    return tb - ta;
  });
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.ALCHEMY_API_KEY || process.env.ALCHEMY_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Alchemy key is not set on this deployment. Add ALCHEMY_API_KEY in Vercel." },
      { status: 500 }
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limited = rateLimit(`wallet:${ip}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limited.retryAfterMs || 1000) / 1000)) } }
    );
  }

  const address = parseWalletAddress(request.nextUrl.searchParams.get("address"));
  const chainParam = request.nextUrl.searchParams.get("chain") || "ethereum";

  if (!address) {
    return NextResponse.json({ error: "Enter a valid Ethereum address." }, { status: 400 });
  }
  if (!isChainId(chainParam)) {
    return NextResponse.json({ error: "Unsupported chain." }, { status: 400 });
  }

  const cacheKey = `wallet:${chainParam}:${address.toLowerCase()}`;
  const cached = getCached<WalletPayload>(cacheKey);
  if (cached) return NextResponse.json(cached);

  const chain = getChain(chainParam);
  const url = alchemyUrl(chain.alchemyNetwork, apiKey);

  try {
    const [balance, transferResult, tokenPrice] = await Promise.all([
      getBalance(address, url),
      getTransfers(address, url),
      getTokenPrice(chain.coingeckoId),
    ]);

    const mapped = mapTransfers(transferResult.transfers, chain.symbol);
    const historyTruncated = transferResult.truncated || mapped.length > MAX_SHOWN;
    const balanceNumber = Number(balance);
    const payload: WalletPayload = {
      address,
      balance,
      balanceUsd: tokenPrice == null ? null : balanceNumber * tokenPrice,
      tokenPrice,
      priceUnavailable: tokenPrice == null,
      transactions: mapped.slice(0, MAX_SHOWN),
      historyTruncated,
      chain: {
        id: chain.id,
        name: chain.name,
        symbol: chain.symbol,
        explorer: chain.explorer,
      },
    };

    setCached(cacheKey, payload, 20_000);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json(
      {
        error: `Could not load ${chain.name}. Enable this network on your Alchemy app, then try again.`,
      },
      { status: 500 }
    );
  }
}
