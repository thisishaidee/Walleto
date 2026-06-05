import { NextRequest, NextResponse } from "next/server";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

// Supported chains with their Alchemy network URLs and native tokens
export const SUPPORTED_CHAINS = {
  ethereum: {
    name: "Ethereum",
    symbol: "ETH",
    alchemyUrl: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    explorer: "https://etherscan.io",
    coingeckoId: "ethereum",
  },
  polygon: {
    name: "Polygon",
    symbol: "POL",
    alchemyUrl: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    explorer: "https://polygonscan.com",
    coingeckoId: "polygon-ecosystem-token",
  },
  arbitrum: {
    name: "Arbitrum",
    symbol: "ETH",
    alchemyUrl: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    explorer: "https://arbiscan.io",
    coingeckoId: "ethereum",
  },
  optimism: {
    name: "Optimism",
    symbol: "ETH",
    alchemyUrl: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    explorer: "https://optimistic.etherscan.io",
    coingeckoId: "ethereum",
  },
  base: {
    name: "Base",
    symbol: "ETH",
    alchemyUrl: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    explorer: "https://basescan.org",
    coingeckoId: "ethereum",
  },
} as const;

export type ChainId = keyof typeof SUPPORTED_CHAINS;

function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

async function getTokenPrice(coingeckoId: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
      { 
        next: { revalidate: 60 },
        headers: {
          "Accept": "application/json",
        }
      }
    );
    
    if (!response.ok) {
      return 0;
    }
    
    const data = await response.json();
    
    const price = data[coingeckoId]?.usd;
    if (typeof price === "number") {
      return price;
    }
    
    return 0;
  } catch {
    return 0;
  }
}

async function getBalance(address: string, alchemyUrl: string): Promise<number> {
  const response = await fetch(alchemyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBalance",
      params: [address, "latest"],
    }),
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message);
  }

  const balanceWei = BigInt(data.result);
  const balanceEth = Number(balanceWei) / 1e18;
  return balanceEth;
}

interface AlchemyTransfer {
  hash: string;
  from: string;
  to: string | null;
  value: number | null;
  metadata: {
    blockTimestamp: string;
  };
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  time: string;
}

async function getTransactions(address: string, alchemyUrl: string): Promise<Transaction[]> {
  const [incomingResponse, outgoingResponse] = await Promise.all([
    fetch(alchemyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock: "0x0",
            toBlock: "latest",
            toAddress: address,
            category: ["external", "internal"],
            maxCount: "0x10",
            order: "desc",
            withMetadata: true,
          },
        ],
      }),
    }),
    fetch(alchemyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 2,
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock: "0x0",
            toBlock: "latest",
            fromAddress: address,
            category: ["external", "internal"],
            maxCount: "0x10",
            order: "desc",
            withMetadata: true,
          },
        ],
      }),
    }),
  ]);

  const [incomingData, outgoingData] = await Promise.all([
    incomingResponse.json(),
    outgoingResponse.json(),
  ]);

  const incomingTransfers: AlchemyTransfer[] = incomingData.result?.transfers || [];
  const outgoingTransfers: AlchemyTransfer[] = outgoingData.result?.transfers || [];

  const allTransfers = [...incomingTransfers, ...outgoingTransfers];

  const uniqueTransfers = allTransfers.reduce((acc, transfer) => {
    if (!acc.find((t) => t.hash === transfer.hash)) {
      acc.push(transfer);
    }
    return acc;
  }, [] as AlchemyTransfer[]);

  const sortedTransfers = uniqueTransfers
    .sort(
      (a, b) =>
        new Date(b.metadata.blockTimestamp).getTime() -
        new Date(a.metadata.blockTimestamp).getTime()
    )
    .slice(0, 10);

  return sortedTransfers.map((transfer) => ({
    hash: transfer.hash,
    from: transfer.from,
    to: transfer.to || "Contract Creation",
    value: transfer.value?.toFixed(6) || "0",
    time: transfer.metadata.blockTimestamp,
  }));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");
  const chainParam = searchParams.get("chain") || "ethereum";
  const chain = chainParam as ChainId;

  if (!ALCHEMY_API_KEY) {
    return NextResponse.json(
      { error: "Alchemy API key not configured" },
      { status: 500 }
    );
  }

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
      { status: 400 }
    );
  }

  if (!isValidEthereumAddress(address)) {
    return NextResponse.json(
      { error: "Invalid Ethereum address format" },
      { status: 400 }
    );
  }

  if (!SUPPORTED_CHAINS[chain]) {
    return NextResponse.json(
      { error: "Unsupported chain" },
      { status: 400 }
    );
  }

  const chainConfig = SUPPORTED_CHAINS[chain];

  try {
    const [balance, transactions, tokenPrice] = await Promise.all([
      getBalance(address, chainConfig.alchemyUrl),
      getTransactions(address, chainConfig.alchemyUrl),
      getTokenPrice(chainConfig.coingeckoId),
    ]);

    const balanceUsd = balance * tokenPrice;

    return NextResponse.json({
      address,
      balance,
      balanceUsd,
      tokenPrice,
      transactions,
      chain: {
        id: chain,
        name: chainConfig.name,
        symbol: chainConfig.symbol,
        explorer: chainConfig.explorer,
      },
    });
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet data. Please try again." },
      { status: 500 }
    );
  }
}
