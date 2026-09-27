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

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Recent transactions</h2>
        <p className="text-sm text-muted-foreground mt-1">Native and ERC-20 · last {transactions.length}</p>
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{isOutgoing ? "Sent" : "Received"}</span>
                    <span className={`text-sm font-semibold ${isOutgoing ? "text-destructive" : "text-primary"}`}>
                      {isOutgoing ? "-" : "+"}{formatValue(tx.value, tx.asset)}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-foreground">
                    <span className="font-mono">
                      {isOutgoing ? "To: " : "From: "}
                      {truncateAddress(isOutgoing ? tx.to : tx.from)}
                    </span>
                    <span>{formatTime(tx.time)}</span>
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
