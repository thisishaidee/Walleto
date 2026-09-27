"use client";

import { Wallet, TrendingUp } from "lucide-react";

interface BalanceCardProps {
  balance: string;
  balanceUsd: number | null;
  tokenPrice: number | null;
  priceUnavailable?: boolean;
  chain: {
    id: string;
    name: string;
    symbol: string;
  };
}

export function BalanceCard({
  balance,
  balanceUsd,
  tokenPrice,
  priceUnavailable,
  chain,
}: BalanceCardProps) {
  const formattedBalance = Number(balance).toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });

  const formattedUsd =
    balanceUsd == null
      ? "Price unavailable"
      : balanceUsd.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  const formattedPrice =
    tokenPrice == null
      ? "—"
      : tokenPrice.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Available balance</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {chain.name}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold text-foreground tracking-tight">{formattedUsd}</span>
        </div>
        <div className="text-lg font-medium text-muted-foreground mb-4">
          {formattedBalance} {chain.symbol}
        </div>
        {!priceUnavailable && (
          <div className="pt-4 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>1 {chain.symbol} = {formattedPrice}</span>
          </div>
        )}
      </div>
    </div>
  );
}
