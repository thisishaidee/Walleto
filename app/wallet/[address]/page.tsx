"use client";

import useSWR from "swr";
import Link from "next/link";
import { Suspense, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { WalletHeader } from "@/components/wallet-header";
import { BalanceCard } from "@/components/balance-card";
import { TransactionList } from "@/components/transaction-list";
import { ActionTiles } from "@/components/action-tiles";
import { BrandLockup } from "@/components/brand-mark";
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

function WalletView({
  rawAddress,
}: {
  rawAddress: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const address = parseWalletAddress(rawAddress);
  const chainParam = searchParams.get("chain") || "ethereum";
  const selectedChain: ChainId = isChainId(chainParam) ? chainParam : "ethereum";
  const chainConfig = getChain(selectedChain);

  const { data, error, isLoading, mutate } = useSWR<WalletData>(
    address ? `/api/wallet?address=${encodeURIComponent(address)}&chain=${selectedChain}` : null,
    fetcher,
    { revalidateOnFocus: true, dedupingInterval: 8000 }
  );

  return (
    <main className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="max-w-xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/" className="p-2 rounded-full hover:bg-secondary shrink-0" title="Back">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <BrandLockup />
          </div>
          <ChainSelector
            selectedChain={selectedChain}
            onChainChange={(chain) => address && router.replace(`/wallet/${address}?chain=${chain}`)}
          />
        </div>
      </header>

      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-6 space-y-5">
        {!address ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6">
            <h3 className="font-semibold mb-2">Invalid address</h3>
            <p className="text-sm text-muted-foreground">That URL is not a valid Ethereum address.</p>
          </div>
        ) : (
          <>
            <WalletHeader address={address} explorerUrl={data?.chain.explorer || chainConfig.explorer} />
            <ActionTiles
              address={address}
              explorerUrl={data?.chain.explorer || chainConfig.explorer}
              onRefresh={() => mutate()}
              refreshing={isLoading}
            />
            {error && (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 flex gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Could not load this wallet</p>
                  <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
                </div>
              </div>
            )}
            {isLoading && !data && (
              <div className="grid gap-5">
                <BalanceCardSkeleton />
                <TransactionListSkeleton />
              </div>
            )}
            {data && (
              <>
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
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function WalletPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = use(params);
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <WalletView rawAddress={address} />
    </Suspense>
  );
}
