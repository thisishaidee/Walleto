export function BalanceCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-secondary" />
        <div className="h-4 w-24 rounded bg-secondary" />
      </div>
      <div className="h-10 w-48 rounded bg-secondary mb-3" />
      <div className="h-6 w-20 rounded bg-secondary" />
    </div>
  );
}

export function TransactionListSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="h-6 w-44 rounded bg-secondary animate-pulse" />
        <div className="h-4 w-32 rounded bg-secondary animate-pulse mt-2" />
      </div>
      <div className="divide-y divide-border">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-16 rounded bg-secondary" />
                  <div className="h-4 w-24 rounded bg-secondary" />
                </div>
                <div className="h-3 w-48 rounded bg-secondary mb-2" />
                <div className="h-3 w-32 rounded bg-secondary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
