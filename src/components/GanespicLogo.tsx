import { GraduationCap } from "lucide-react";

type GanespicLogoProps = {
  size?: number;
  className?: string;
};

export default function GanespicLogo({ size = 200, className = "" }: GanespicLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 280 280" className="absolute inset-0 h-full w-full">
        <defs>
          <path id="ganespic-motto-arc" d="M 25 140 A 115 115 0 0 1 255 140" fill="none" />
        </defs>
        {/* Decorative rings */}
        <circle
          cx="140"
          cy="140"
          r="125"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.25"
        />
        <circle
          cx="140"
          cy="140"
          r="118"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.15"
        />
        {/* Motto text following the top semicircle arc */}
        <text
          fill="currentColor"
          fontSize="11"
          fontWeight="700"
          letterSpacing="2"
          fontFamily="'Plus Jakarta Sans', sans-serif"
        >
          <textPath href="#ganespic-motto-arc" startOffset="50%" textAnchor="middle">
            MELANGKAH KEDEPAN MENUJU KEMENANGAN
          </textPath>
        </text>
        {/* Decorative dots at arc endpoints */}
        <circle cx="25" cy="140" r="3" fill="currentColor" opacity="0.4" />
        <circle cx="255" cy="140" r="3" fill="currentColor" opacity="0.4" />
        {/* Small star decorations at top */}
        <circle cx="140" cy="18" r="2" fill="currentColor" opacity="0.5" />
      </svg>
      {/* Center emblem */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-950 text-sage-300 shadow-lg shadow-sage-950/20 dark:bg-sage-400 dark:text-sage-950">
          <GraduationCap size={28} strokeWidth={2.5} />
        </div>
        <span className="mt-1.5 font-display text-[11px] font-extrabold tracking-[0.2em] text-sage-950 dark:text-sage-100">
          GANESPIC
        </span>
        <span className="text-[9px] font-bold tracking-widest text-sage-700 dark:text-sage-400">
          XXV
        </span>
      </div>
    </div>
  );
}
