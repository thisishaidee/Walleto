import { SearchBar } from "@/components/search-bar";
import { Wallet } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <span className="font-semibold text-foreground">EVM Tracker</span>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Ethereum Mainnet
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Track Any Ethereum Wallet
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Enter a wallet address to view balance, transaction history, and more.
            Real-time data from the Ethereum blockchain.
          </p>
        </div>

        <SearchBar />

        {/* Example addresses */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">Try an example:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
              "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8",
            ].map((addr) => (
              <a
                key={addr}
                href={`/wallet/${addr}`}
                className="px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 text-xs font-mono transition-colors"
              >
                {addr.slice(0, 6)}...{addr.slice(-4)}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-border py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Real-time Balance",
              description: "View current ETH balance instantly",
            },
            {
              title: "Transaction History",
              description: "Browse recent transactions with details",
            },
            {
              title: "Etherscan Links",
              description: "Quick access to full blockchain data",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-5 rounded-xl border border-border bg-card/50"
            >
              <h3 className="font-semibold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>EVM Wallet Tracker</span>
          <span>Powered by Ethereum</span>
        </div>
      </footer>
    </main>
  );
}
