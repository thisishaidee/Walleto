export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="40 52 176 152" className={className} aria-hidden>
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

export function BrandWordmark({ className = "text-[26px]" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center lowercase tracking-[0.03em] leading-none text-foreground font-medium ${className}`}>
      wallet
      <span
        aria-hidden
        className="ml-[3px] inline-block shrink-0 rounded-full border-[2.25px] border-current"
        style={{ width: "0.78em", height: "0.78em", transform: "translateY(0.02em)" }}
      />
    </span>
  );
}

export function BrandLockup() {
  return (
    <div className="flex items-center gap-2.5">
      <BrandMark className="h-8 w-8 shrink-0" />
      <BrandWordmark className="text-[24px] sm:text-[26px]" />
    </div>
  );
}
