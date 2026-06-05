"use client";

import useSWR from "swr";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Wallet, AlertCircle, RefreshCw } from "lucide-react";
import { WalletHeader } from "@/components/wallet-header";
import { BalanceCard } from "@/components/balance-card";
import { TransactionList } from "@/components/transaction-list";
import { BalanceCardSkeleton, TransactionListSkeleton } from "@/components/skeletons";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  time: string;
}

interface WalletData {
  address: string;
  balance: number;
  transactions: Transaction[];
}

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error("Failed to fetch wallet data");
  }
  return res.json();
});

export default function WalletPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = use(params);
  
  const { data, error, isLoading, mutate } = useSWR<WalletData>(
    `/api/wallet?address=${address}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="Back to search"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold text-foreground">EVM Tracker</span>
            </div>
          </div>
          <button
            onClick={() => mutate()}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw className={`h-5 w-5 text-muted-foreground ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Wallet Header */}
        <div className="mb-8">
          <WalletHeader address={address} />
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-destructive/20">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Failed to load wallet data
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                There was an error fetching data for this wallet. Please try again.
              </p>
              <button
                onClick={() => mutate()}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className="grid gap-6">
            <BalanceCardSkeleton />
            <TransactionListSkeleton />
          </div>
        )}

        {/* Success State */}
        {data && !error && (
          <div className="grid gap-6">
            <BalanceCard balance={data.balance} />
            <TransactionList
              transactions={data.transactions}
              walletAddress={address}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>EVM Wallet Tracker</span>
          <span>Powered by Ethereum</span>
        </div>
      </footer>
    </main>
  );
}
