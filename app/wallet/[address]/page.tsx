"use client";

import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { use, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import { WalletHeader } from "@/components/wallet-header";
import { BalanceCard } from "@/components/balance-card";
import { TransactionList } from "@/components/transaction-list";
import { BalanceCardSkeleton, TransactionListSkeleton } from "@/components/skeletons";
import { ChainSelector, type ChainId } from "@/components/chain-selector";
import { parseWalletAddress } from "@/lib/address";
import { getChain, isChainId } from "@/lib/chains";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  asset: string;
  time: string;
}

interface WalletData {
  address: string;
  balance: string;
  balanceUsd: number | null;
  tokenPrice: number | null;
  priceUnavailable: boolean;
  transactions: Transaction[];
  chain: {
    id: string;
    name: string;
    symbol: string;
    explorer: string;
  };
}

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || "Failed to fetch wallet data");
    return body;
  });

export default function WalletPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address: rawAddress } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const address = parseWalletAddress(rawAddress);
  const chainParam = searchParams.get("chain") || "ethereum";
  const selectedChain: ChainId = isChainId(chainParam) ? chainParam : "ethereum";
  const chainConfig = getChain(selectedChain);

  const { data, error, isLoading, mutate } = useSWR<WalletData>(
    address ? `/api/wallet?address=${encodeURIComponent(address)}&chain=${selectedChain}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleChainChange = (chain: ChainId) => {
    if (!address) return;
    router.replace(`/wallet/${address}?chain=${chain}`);
  };

  const invalid = useMemo(() => !address, [address]);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-lg hover:bg-secondary transition-colors" title="Back to search">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div className="flex items-center gap-3">
              <Image src="/walleto-mark.svg" alt="" width={32} height={32} className="rounded-md" />
              <span className="font-medium lowercase tracking-wide text-foreground">walleto</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChainSelector selectedChain={selectedChain} onChainChange={handleChainChange} />
            <button
              onClick={() => mutate()}
              disabled={isLoading || invalid}
              className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`h-5 w-5 text-muted-foreground ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {invalid ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
            <h3 className="font-semibold mb-2">Invalid address</h3>
            <p className="text-sm text-muted-foreground">That URL is not a valid Ethereum address.</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <WalletHeader address={address} explorerUrl={data?.chain.explorer || chainConfig.explorer} />
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 flex items-start gap-4">
                <div className="p-2 rounded-lg bg-destructive/20">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Failed to load wallet data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {error.message || "There was an error fetching data for this wallet."}
                  </p>
                  <button
                    onClick={() => mutate()}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {isLoading && !error && (
              <div className="grid gap-6">
                <BalanceCardSkeleton />
                <TransactionListSkeleton />
              </div>
            )}

            {data && !error && (
              <div className="grid gap-6">
                <BalanceCard
                  balance={data.balance}
                  balanceUsd={data.balanceUsd}
                  tokenPrice={data.tokenPrice}
                  priceUnavailable={data.priceUnavailable}
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
          </>
        )}
      </div>
    </main>
  );
}
