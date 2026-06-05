import { Wallet } from "lucide-react";

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  const formattedBalance = balance.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            ETH Balance
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-foreground tracking-tight">
            {formattedBalance}
          </span>
          <span className="text-lg font-medium text-muted-foreground">ETH</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Mainnet
          </span>
        </div>
      </div>
    </div>
  );
}
