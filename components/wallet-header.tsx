"use client";

import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

interface WalletHeaderProps {
  address: string;
  explorerUrl?: string;
}

export function WalletHeader({ address, explorerUrl = "https://etherscan.io" }: WalletHeaderProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary/30 flex items-center justify-center">
          <span className="text-lg font-bold text-primary-foreground">
            {address.slice(2, 4).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Wallet Address</p>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-mono font-semibold text-foreground">
              <span className="hidden sm:inline">{address}</span>
              <span className="sm:hidden">{truncatedAddress}</span>
            </h1>
            <button
              onClick={copyToClipboard}
              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
              title="Copy address"
            >
              {copied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            <a
              href={`${explorerUrl}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
              title="View on Explorer"
            >
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
