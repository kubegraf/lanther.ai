import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:translate-y-px";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-bg hover:bg-white shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_8px_24px_-8px_rgb(110_139_255/0.55)] hover:shadow-[0_0_0_1px_rgb(255_255_255/0.2),0_10px_32px_-8px_rgb(110_139_255/0.8)]",
  secondary: "border hairline-strong bg-white/[0.03] text-ink hover:bg-white/[0.07] hover:border-white/25",
  ghost: "text-muted hover:text-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-[15px]",
};

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
};

/** Every CTA on this page navigates, so buttons are anchors. */
export function Button({ variant = "primary", size = "md", arrow, className, children, ...rest }: Props) {
  return (
    <a className={`${base} ${variants[variant]} ${sizes[size]} ${className ?? ""}`} {...rest}>
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      )}
    </a>
  );
}
