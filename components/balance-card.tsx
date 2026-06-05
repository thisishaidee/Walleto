"use client";

import { Wallet, TrendingUp } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  balanceUsd?: number | null;
  tokenPrice?: number | null;
  chain: {
    id: string;
    name: string;
    symbol: string;
  };
}

export function BalanceCard({ balance, balanceUsd, tokenPrice, chain }: BalanceCardProps) {
  const safeBalanceUsd = balanceUsd ?? 0;
  const safeTokenPrice = tokenPrice ?? 0;

  const formattedBalance = balance.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });

  const formattedUsd = safeBalanceUsd.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedPrice = safeTokenPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {chain.symbol} Balance
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {chain.name}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold text-foreground tracking-tight">
            {formattedBalance}
          </span>
          <span className="text-lg font-medium text-muted-foreground">{chain.symbol}</span>
        </div>

        <div className="flex items-center gap-2 text-2xl font-semibold text-primary">
          {formattedUsd}
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span>1 {chain.symbol} = {formattedPrice}</span>
        </div>
      </div>
    </div>
  );
}
