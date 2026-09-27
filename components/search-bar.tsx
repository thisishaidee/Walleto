"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { parseWalletAddress } from "@/lib/address";

export function SearchBar() {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsed = parseWalletAddress(address);
    if (!address.trim()) {
      setError("Please enter a wallet address");
      return;
    }
    if (!parsed) {
      setError("Invalid Ethereum address");
      return;
    }
    setIsLoading(true);
    router.push(`/wallet/${parsed}?chain=ethereum`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setError("");
          }}
          placeholder="Enter wallet address (0x...)"
          className="w-full h-14 pl-12 pr-32 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono text-sm"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading</span>
            </>
          ) : (
            "Track"
          )}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-destructive flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive" />
          {error}
        </p>
      )}
    </form>
  );
}
