"use client";

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
      ? "—"
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
    <div className="rounded-[28px] bg-gradient-to-br from-[#E8D7F4] via-[#F4ECF8] to-[#F6F1EA] border border-[#e4d7c8] p-6 sm:p-8">
      <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground text-center">Available balance</p>
      <p className="mt-3 text-center text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
        {priceUnavailable ? "Price unavailable" : formattedUsd}
      </p>
      <p className="mt-2 text-center text-muted-foreground">
        {formattedBalance} {chain.symbol}
      </p>
      <div className="mt-5 flex justify-center">
        <span className="px-3 py-1 rounded-full bg-white/60 text-xs text-muted-foreground">
          {chain.name}
          {!priceUnavailable && ` · 1 ${chain.symbol} = ${formattedPrice}`}
        </span>
      </div>
    </div>
  );
}
