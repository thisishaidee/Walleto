"use client";

import { Copy, Check, ExternalLink, RefreshCw } from "lucide-react";
import { useState } from "react";

export function ActionTiles({
  address,
  explorerUrl,
  onRefresh,
  refreshing,
}: {
  address: string;
  explorerUrl: string;
  onRefresh: () => void;
  refreshing?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const tile =
    "flex flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card py-5 text-sm font-medium text-foreground hover:bg-secondary transition-colors";

  return (
    <div className="grid grid-cols-3 gap-3">
      <button type="button" onClick={copy} className={tile}>
        {copied ? <Check className="h-5 w-5 text-primary" /> : <Copy className="h-5 w-5" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <a href={`${explorerUrl}/address/${address}`} target="_blank" rel="noopener noreferrer" className={tile}>
        <ExternalLink className="h-5 w-5" />
        Explorer
      </a>
      <button type="button" onClick={onRefresh} disabled={refreshing} className={tile}>
        <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
        Refresh
      </button>
    </div>
  );
}
