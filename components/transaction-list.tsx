"use client";

import { ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  time: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  walletAddress: string;
}

export function TransactionList({ transactions, walletAddress }: TransactionListProps) {
  const truncateHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const formatValue = (value: string) => {
    const num = parseFloat(value);
    if (num === 0) return "0 ETH";
    if (num < 0.0001) return "< 0.0001 ETH";
    return `${num.toLocaleString("en-US", { maximumFractionDigits: 4 })} ETH`;
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
        <h2 className="text-lg font-semibold text-foreground">
          Recent Transactions
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Last {transactions.length} transactions
        </p>
      </div>

      <div className="divide-y divide-border">
        {transactions.map((tx) => {
          const isOutgoing = tx.from.toLowerCase() === walletAddress.toLowerCase();
          
          return (
            <div
              key={tx.hash}
              className="p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div
                    className={`p-2 rounded-lg ${
                      isOutgoing
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {isOutgoing ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownLeft className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {isOutgoing ? "Sent" : "Received"}
                      </span>
                      <span className={`text-sm font-semibold ${
                        isOutgoing ? "text-destructive" : "text-primary"
                      }`}>
                        {isOutgoing ? "-" : "+"}{formatValue(tx.value)}
                      </span>
                    </div>
                    
                    <div className="mt-1.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-foreground">
                      <span className="font-mono">
                        {isOutgoing ? "To: " : "From: "}
                        {truncateAddress(isOutgoing ? tx.to : tx.from)}
                      </span>
                      <span className="hidden sm:inline text-border">•</span>
                      <span>{formatTime(tx.time)}</span>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {truncateHash(tx.hash)}
                      </span>
                      <a
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded hover:bg-secondary transition-colors"
                        title="View on Etherscan"
                      >
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </a>
                    </div>
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
