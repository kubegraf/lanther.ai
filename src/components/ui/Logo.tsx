import { useId } from "react";

/**
 * The Lanther mark: a connection path that turns a corner between two
 * endpoints. Reads as an "L" and as a routed link. Same drawing at every size;
 * it has no detail finer than 2px at 16px.
 */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`${id}-g`} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8EA5FF" />
          <stop offset="1" stopColor="#9B7BFF" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="8" fill="#10131A" stroke={`url(#${id}-g)`} strokeOpacity="0.55" />
      <path d="M11 8.5v10.5a4 4 0 0 0 4 4h8.5" stroke={`url(#${id}-g)`} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="11" cy="8.5" r="2.6" fill="#EDEFF5" />
      <circle cx="23.5" cy="23" r="2.6" fill={`url(#${id}-g)`} />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-tight text-ink">Lanther</span>
    </span>
  );
}
