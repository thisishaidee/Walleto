"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CHAINS, type ChainId } from "@/lib/chains";

export { CHAINS, type ChainId };

interface ChainSelectorProps {
  selectedChain: ChainId;
  onChainChange: (chain: ChainId) => void;
}

export function ChainSelector({ selectedChain, onChainChange }: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = CHAINS.find((c) => c.id === selectedChain) || CHAINS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors border border-border"
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selected.color }} />
        <span className="text-sm font-medium text-foreground">{selected.name}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-52 max-h-80 overflow-y-auto rounded-lg border border-border bg-card shadow-lg z-50">
          {CHAINS.map((chain) => (
            <button
              key={chain.id}
              onClick={() => {
                onChainChange(chain.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary transition-colors ${
                chain.id === selectedChain ? "bg-secondary/50" : ""
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chain.color }} />
              <span className="text-sm font-medium text-foreground">{chain.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{chain.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
