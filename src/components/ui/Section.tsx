import type { ReactNode } from "react";
import { m } from "framer-motion";
import { fadeUp, stagger, viewport } from "../../lib/motion";

export function Section({
  id,
  children,
  className,
  labelledBy,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative py-20 sm:py-24 lg:py-28 ${className ?? ""}`}>
      <div className="container-site">{children}</div>
    </section>
  );
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <m.header
      variants={stagger(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={`${centered ? "mx-auto text-center" : ""} max-w-3xl ${className ?? ""}`}
    >
      <m.p variants={fadeUp} className="eyebrow">
        {eyebrow}
      </m.p>
      <m.h2
        variants={fadeUp}
        id={id}
        className="mt-4 text-balance text-[32px] font-semibold leading-[1.08] tracking-tightest text-ink sm:text-[44px] lg:text-[52px]"
      >
        {title}
      </m.h2>
      {lead && (
        <m.p
          variants={fadeUp}
          className={`mt-5 text-pretty text-[17px] leading-relaxed text-muted sm:text-lg ${centered ? "mx-auto" : ""} max-w-2xl`}
        >
          {lead}
        </m.p>
      )}
    </m.header>
  );
}

/** Fades children in once as they scroll into view. `as="li"` keeps lists valid. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li";
}) {
  const Tag = as === "li" ? m.li : m.div;
  return (
    <Tag
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </Tag>
  );
}
