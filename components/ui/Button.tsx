"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { isRouteBuilt } from "@/lib/constants/site";

const MotionLink = motion.create(Link);

type ButtonVariant = "primary" | "glass" | "ghost";
type ButtonSize = "md" | "lg";

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  showIcon?: boolean;
  icon?: ReactNode;
};

type ButtonAsLink = SharedProps & {
  href: string;
  target?: string;
  rel?: string;
};

type ButtonAsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonProps = ButtonAsLink | ButtonAsButton;

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(135deg,var(--color-peach-400),var(--color-rose-500))] text-text-inverse shadow-[0_10px_40px_-12px_rgba(216,136,128,0.55)] hover:shadow-[0_14px_50px_-10px_rgba(216,136,128,0.7)]",
  glass:
    "glass-surface text-text-primary hover:border-peach-300/60",
  ghost:
    "bg-transparent text-text-primary border border-glass-border hover:bg-glass-bg",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    showIcon = true,
    icon,
  } = props;

  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold tracking-tight transition-colors duration-300 disabled:pointer-events-none disabled:opacity-60",
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {showIcon ? (
        // rtl:-scale-x-100 mirrors the default arrow to point up-left
        // instead of up-right, matching RTL reading direction — a custom
        // `icon` override is assumed pre-chosen by the caller and left
        // un-mirrored.
        <span
          className={cn(
            "inline-flex transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            !icon && "rtl:-scale-x-100",
          )}
        >
          {icon ?? <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden="true" />}
        </span>
      ) : null}
    </>
  );

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    return (
      <MotionLink
        href={href}
        target={target}
        rel={rel}
        // Only Home is built so far — avoid prefetching not-yet-built routes
        // (and external/tel/mailto links, which don't need it anyway).
        prefetch={isRouteBuilt(href) ? undefined : false}
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {content}
      </MotionLink>
    );
  }

  const { type = "button", onClick, disabled, "aria-label": ariaLabel } = props as ButtonAsButton;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {content}
    </motion.button>
  );
}
