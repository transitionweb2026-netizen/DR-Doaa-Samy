/**
 * Minimal inline brand glyphs. lucide-react no longer ships social/brand
 * icons, so these small monochrome outlines fill that gap without adding
 * a dependency. Swap freely for an icon set of your choice later.
 */

type IconProps = { size?: number; className?: string };

function svgProps(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

export function InstagramGlyph({ size = 16, className }: IconProps) {
  return (
    <svg {...svgProps(size)} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookGlyph({ size = 16, className }: IconProps) {
  return (
    <svg {...svgProps(size)} className={className}>
      <path d="M14.5 21v-7.2h2.4l.4-2.8h-2.8V9.1c0-.8.2-1.4 1.4-1.4h1.5V5.2c-.3 0-1.1-.1-2-.1-2.1 0-3.5 1.3-3.5 3.6v2.3H9.5v2.8h2.4V21" />
    </svg>
  );
}

export function TiktokGlyph({ size = 16, className }: IconProps) {
  return (
    <svg {...svgProps(size)} className={className}>
      <path d="M14 4v10.2a2.9 2.9 0 1 1-2.1-2.8" />
      <path d="M14 4c.35 2.1 1.9 3.6 4 3.85" />
    </svg>
  );
}

export function YoutubeGlyph({ size = 16, className }: IconProps) {
  return (
    <svg {...svgProps(size)} className={className}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="M10.5 9.6 15 12l-4.5 2.4Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WhatsappGlyph({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.44 1.33 4.94L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.83 14.24c-.25.7-1.24 1.29-2.02 1.46-.54.11-1.24.2-3.6-.77-3.02-1.25-4.96-4.32-5.11-4.52-.15-.2-1.22-1.62-1.22-3.09 0-1.47.77-2.19 1.04-2.49.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.68.53.25.61.85 2.1.92 2.25.07.15.12.33.02.53-.1.2-.15.32-.3.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.77 1.28 1.66 2.07 1.14 1.02 2.1 1.34 2.4 1.49.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.77.84 2.08 1 .3.15.5.23.58.35.07.13.07.75-.18 1.45Z" />
    </svg>
  );
}

export const SOCIAL_GLYPHS: Record<string, (props: IconProps) => React.JSX.Element> = {
  instagram: InstagramGlyph,
  facebook: FacebookGlyph,
  tiktok: TiktokGlyph,
  youtube: YoutubeGlyph,
  whatsapp: WhatsappGlyph,
};
