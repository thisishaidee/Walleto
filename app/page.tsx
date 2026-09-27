import Image from "next/image";
import { SearchBar } from "@/components/search-bar";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <Image src="/walleto-mark.svg" alt="" width={36} height={36} className="rounded-lg" />
          <span className="text-xl tracking-wide text-foreground lowercase">walleto</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center mb-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Ethereum, Polygon, Arbitrum, Optimism, Base
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Track any EVM wallet
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Native balance, USD value, and recent native + ERC-20 transfers. Read-only. No keys.
          </p>
        </div>

        <SearchBar />

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">Try an example:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
              "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8",
            ].map((addr) => (
              <a
                key={addr}
                href={`/wallet/${addr}?chain=ethereum`}
                className="px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 text-xs font-mono transition-colors"
              >
                {addr.slice(0, 6)}...{addr.slice(-4)}
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span className="lowercase">walleto</span>
          <span>5 chains · read only</span>
        </div>
      </footer>
    </main>
  );
}
