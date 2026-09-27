export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} aria-hidden>
      <rect width="256" height="256" rx="48" fill="#F3EEE6" />
      <g transform="translate(56 68)">
        <path d="M0 0 L72 0 L0 88 Z" fill="#C9B6E4" />
        <path d="M8 28 L86 0 L62 120 L0 120 Z" fill="#D4C4EE" />
        <path d="M28 120 L44 120 L78 8 L70 0 L22 112 Z" fill="#F3EEE6" />
        <path d="M70 8 L112 120 L86 120 L54 28 Z" fill="#B59BD6" />
        <path d="M96 28 L144 0 L144 120 L80 120 Z" fill="#6B4BA3" />
        <path d="M108 0 L144 0 L144 52 Z" fill="#7A58B0" />
        <path d="M96 28 L144 52 L144 120 L80 120 Z" fill="#5C3E96" />
      </g>
    </svg>
  );
}

export function BrandWordmark({ className = "text-[28px]" }: { className?: string }) {
  return (
    <span className={`lowercase tracking-[0.04em] text-foreground font-medium ${className}`}>
      wallet
      <span className="inline-block ml-[2px] h-[0.72em] w-[0.72em] rounded-full border-[2.5px] border-current align-[-1px]" />
    </span>
  );
}
