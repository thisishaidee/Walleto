import { NextRequest, NextResponse } from "next/server";
import { formatEther } from "viem";
import { parseWalletAddress } from "@/lib/address";
import { alchemyUrl, getChain, isChainId } from "@/lib/chains";
import { getCached, rateLimit, setCached } from "@/lib/rate-limit";

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

async function getTransfers(address: string, url: string, direction: "from" | "to") {
  const params: Record<string, unknown> = {
    fromBlock: "0x0",
    toBlock: "latest",
    category: ["external", "internal", "erc20"],
    maxCount: "0x14",
    order: "desc",
    withMetadata: true,
    excludeZeroValue: false,
  };
  if (direction === "from") params.fromAddress = address;
  else params.toAddress = address;

  const data = await readJson(
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: direction === "from" ? 2 : 1,
        method: "alchemy_getAssetTransfers",
        params: [params],
      }),
    })
  );
  if (data.error) throw new Error(data.error.message ?? "Transfer lookup failed");
  return (data.result?.transfers ?? []) as AlchemyTransfer[];
}

function mapTransfers(transfers: AlchemyTransfer[]): Transaction[] {
  const seen = new Set<string>();
  const mapped: Transaction[] = [];

  for (const transfer of transfers) {
    const uniqueId = transfer.uniqueId || `${transfer.hash}:${transfer.category}:${transfer.from}:${transfer.to}:${transfer.asset}`;
    if (seen.has(uniqueId)) continue;
    seen.add(uniqueId);
    mapped.push({
      hash: transfer.hash,
      from: transfer.from,
      to: transfer.to || "Contract Creation",
      value: transfer.value == null ? "0" : String(transfer.value),
      asset: transfer.asset || "ETH",
      category: transfer.category || "external",
      uniqueId,
      time: transfer.metadata?.blockTimestamp || new Date().toISOString(),
    });
  }

  return mapped
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 20);
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.ALCHEMY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Wallet data is temporarily unavailable." }, { status: 500 });
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
    const [balance, incoming, outgoing, tokenPrice] = await Promise.all([
      getBalance(address, url),
      getTransfers(address, url, "to"),
      getTransfers(address, url, "from"),
      getTokenPrice(chain.coingeckoId),
    ]);

    const balanceNumber = Number(balance);
    const payload: WalletPayload = {
      address,
      balance,
      balanceUsd: tokenPrice == null ? null : balanceNumber * tokenPrice,
      tokenPrice,
      priceUnavailable: tokenPrice == null,
      transactions: mapTransfers([...incoming, ...outgoing]),
      chain: {
        id: chain.id,
        name: chain.name,
        symbol: chain.symbol,
        explorer: chain.explorer,
      },
    };

    setCached(cacheKey, payload, 25_000);
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json({ error: "Failed to fetch wallet data. Please try again." }, { status: 500 });
  }
}
