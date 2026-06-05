import { NextRequest, NextResponse } from "next/server";

// Mock data generator for demo purposes
// In production, this would connect to a real blockchain API like Etherscan, Alchemy, or Infura

function generateMockTransactions(address: string, count: number = 10) {
  const transactions = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const isOutgoing = Math.random() > 0.5;
    const value = (Math.random() * 2).toFixed(6);
    const time = new Date(now - i * 3600000 * Math.random() * 24).toISOString();

    transactions.push({
      hash: `0x${generateRandomHex(64)}`,
      from: isOutgoing ? address : `0x${generateRandomHex(40)}`,
      to: isOutgoing ? `0x${generateRandomHex(40)}` : address,
      value,
      time,
    });
  }

  return transactions.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );
}

function generateRandomHex(length: number): string {
  const chars = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

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

  // Generate mock data
  // In production, replace this with actual blockchain API calls
  const balance = Math.random() * 100;
  const transactions = generateMockTransactions(address, 10);

  return NextResponse.json({
    address,
    balance,
    transactions,
  });
}
