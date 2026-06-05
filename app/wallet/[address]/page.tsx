"use client";

import useSWR from "swr";
import Link from "next/link";
import { use, useState } from "react";
import { ArrowLeft, Wallet, AlertCircle, RefreshCw } from "lucide-react";
import { WalletHeader } from "@/components/wallet-header";
import { BalanceCard } from "@/components/balance-card";
import { TransactionList } from "@/components/transaction-list";
import { BalanceCardSkeleton, TransactionListSkeleton } from "@/components/skeletons";
import { ChainSelector, type ChainId, CHAINS } from "@/components/chain-selector";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  time: string;
}

interface ChainInfo {
  id: string;
  name: string;
  symbol: string;
  explorer: string;
}

interface WalletData {
  address: string;
  balance: number;
  balanceUsd: number;
  tokenPrice: number;
  transactions: Transaction[];
  chain: ChainInfo;
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
  const [selectedChain, setSelectedChain] = useState<ChainId>("ethereum");
  
  const { data, error, isLoading, mutate } = useSWR<WalletData>(
    `/api/wallet?address=${address}&chain=${selectedChain}`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const handleChainChange = (chain: ChainId) => {
    setSelectedChain(chain);
  };

  const chainConfig = CHAINS.find((c) => c.id === selectedChain) || CHAINS[0];

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
          <div className="flex items-center gap-2">
            <ChainSelector
              selectedChain={selectedChain}
              onChainChange={handleChainChange}
            />
            <button
              onClick={() => mutate()}
              disabled={isLoading}
              className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`h-5 w-5 text-muted-foreground ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Wallet Header */}
        <div className="mb-8">
          <WalletHeader 
            address={address} 
            explorerUrl={data?.chain.explorer || chainConfig.explorer || "https://etherscan.io"} 
          />
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
            <BalanceCard 
              balance={data.balance} 
              balanceUsd={data.balanceUsd}
              tokenPrice={data.tokenPrice}
              chain={data.chain}
            />
            <TransactionList
              transactions={data.transactions}
              walletAddress={address}
              explorerUrl={data.chain.explorer}
              symbol={data.chain.symbol}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>EVM Wallet Tracker</span>
          <span>5 Chains Supported</span>
        </div>
      </footer>
    </main>
  );
}
