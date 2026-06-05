import { NextRequest, NextResponse } from "next/server";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ALCHEMY_BASE_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

async function getEthBalance(address: string): Promise<number> {
  const response = await fetch(ALCHEMY_BASE_URL, {
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

  // Convert from wei (hex) to ETH
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

async function getTransactions(address: string): Promise<Transaction[]> {
  // Get both incoming and outgoing transfers
  const [incomingResponse, outgoingResponse] = await Promise.all([
    fetch(ALCHEMY_BASE_URL, {
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
    fetch(ALCHEMY_BASE_URL, {
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

  // Combine and format transactions
  const allTransfers = [...incomingTransfers, ...outgoingTransfers];

  // Remove duplicates based on hash
  const uniqueTransfers = allTransfers.reduce((acc, transfer) => {
    if (!acc.find((t) => t.hash === transfer.hash)) {
      acc.push(transfer);
    }
    return acc;
  }, [] as AlchemyTransfer[]);

  // Sort by timestamp (newest first) and take top 10
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

  try {
    const [balance, transactions] = await Promise.all([
      getEthBalance(address),
      getTransactions(address),
    ]);

    return NextResponse.json({
      address,
      balance,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet data. Please try again." },
      { status: 500 }
    );
  }
}
