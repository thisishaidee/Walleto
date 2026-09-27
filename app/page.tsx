import { SearchBar } from "@/components/search-bar";
import { BrandMark, BrandWordmark } from "@/components/brand-mark";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-4 py-5">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <BrandMark className="h-10 w-10" />
          <BrandWordmark />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
        <div className="w-full max-w-xl rounded-[28px] bg-gradient-to-br from-[#EDE0F8] via-[#F6F1EA] to-[#E8D7F4] p-8 sm:p-10 text-center border border-[#e4d7c8]">
          <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground mb-4">Available across 5 chains</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-3">
            Look up any wallet
          </h1>
          <p className="text-muted-foreground mb-8">
            Balances and transfers. Read-only. Nothing here can move funds.
          </p>
          <SearchBar />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {[
            "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
            "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8",
          ].map((addr) => (
            <a
              key={addr}
              href={`/wallet/${addr}?chain=ethereum`}
              className="px-3 py-1.5 rounded-full bg-secondary text-xs font-mono text-muted-foreground hover:text-foreground"
            >
              {addr.slice(0, 6)}...{addr.slice(-4)}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
