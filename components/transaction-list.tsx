"use client";

import { ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  asset?: string;
  time: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  walletAddress: string;
  explorerUrl?: string;
  symbol?: string;
}

function formatWhen(time: string) {
  if (!time) return "Time unknown";
  const date = new Date(time);
  if (Number.isNaN(date.getTime())) return "Time unknown";

  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const clock = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  if (sameDay) return `Today, ${clock}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();
  if (isYesterday) return `Yesterday, ${clock}`;

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TransactionList({
  transactions,
  walletAddress,
  explorerUrl = "https://etherscan.io",
  symbol = "ETH",
}: TransactionListProps) {
  const truncateHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const formatValue = (value: string, asset?: string) => {
    const num = parseFloat(value);
    const ticker = asset || symbol;
    if (!Number.isFinite(num) || num === 0) return `0 ${ticker}`;
    if (num < 0.0001) return `< 0.0001 ${ticker}`;
    return `${num.toLocaleString("en-US", { maximumFractionDigits: 4 })} ${ticker}`;
  };

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No transactions found on this chain</p>
        <p className="text-xs text-muted-foreground mt-2">Switch the chain in the header if the transfer was on another network.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Recent transactions</h2>
        <p className="text-sm text-muted-foreground mt-1">Newest first · native and ERC-20</p>
      </div>
      <div className="divide-y divide-border">
        {transactions.map((tx) => {
          const isOutgoing = tx.from.toLowerCase() === walletAddress.toLowerCase();
          return (
            <div key={`${tx.hash}-${tx.from}-${tx.to}-${tx.asset}`} className="p-4 hover:bg-secondary/50 transition-colors">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`p-2 rounded-lg ${isOutgoing ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                  {isOutgoing ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">{isOutgoing ? "Sent" : "Received"}</span>
                    <span className={`text-sm font-semibold ${isOutgoing ? "text-destructive" : "text-primary"}`}>
                      {isOutgoing ? "-" : "+"}{formatValue(tx.value, tx.asset)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-col gap-1 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground/70">{formatWhen(tx.time)}</span>
                    <span className="font-mono">
                      {isOutgoing ? "To: " : "From: "}
                      {truncateAddress(isOutgoing ? tx.to : tx.from)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{truncateHash(tx.hash)}</span>
                    <a href={`${explorerUrl}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-secondary">
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
