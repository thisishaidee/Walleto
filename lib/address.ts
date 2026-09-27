const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;

export function parseWalletAddress(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!ADDRESS_RE.test(trimmed)) return null;
  return `0x${trimmed.slice(2)}`;
}

export function formatEther(wei: bigint): string {
  const negative = wei < 0n;
  const value = negative ? -wei : wei;
  const whole = value / 1000000000000000000n;
  const fraction = (value % 1000000000000000000n).toString().padStart(18, "0").replace(/0+$/, "");
  const formatted = fraction ? `${whole}.${fraction}` : whole.toString();
  return negative ? `-${formatted}` : formatted;
}
