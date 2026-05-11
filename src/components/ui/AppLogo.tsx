import { useState } from 'react';

interface AppLogoProps {
  appIconDataUrl?: string;
  appName: string;
  className?: string;
  showWordmark?: boolean;
  interactive?: boolean;
}

const logoInteractionClass =
  'transition-opacity duration-200 ease-out hover:opacity-80';

const PrysmaMark = ({ className }: { className: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 64 64"
    className={className}
    fill="none"
  >
    <defs>
      <linearGradient id="prysma-gradient" x1="10" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="0.52" stopColor="#06b6d4" />
        <stop offset="1" stopColor="#0f766e" />
      </linearGradient>
    </defs>
    <path
      d="M32 6 52 18v28L32 58 12 46V18L32 6Z"
      fill="url(#prysma-gradient)"
      stroke="rgba(255,255,255,0.8)"
      strokeWidth="1.5"
    />
    <path
      d="M32 6v52M12 18l20 12 20-12M12 46l20-16 20 16"
      stroke="rgba(255,255,255,0.35)"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M25 20.5h10.5c4.1 0 7 2.4 7 6.3 0 4.4-3 6.9-7.8 6.9H30v9.3h-5V20.5Zm5 4.3v4.8h5c1.8 0 2.9-.9 2.9-2.4 0-1.5-1.1-2.4-2.9-2.4h-5Z"
      fill="white"
    />
  </svg>
);

export function AppLogo({
  appIconDataUrl = '',
  appName,
  className = 'h-10 w-10',
  showWordmark = false,
  interactive = false,
}: AppLogoProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const resolvedIconUrl = appIconDataUrl.trim();
  const iconNode = resolvedIconUrl && !hasImageError ? (
    <img
      src={resolvedIconUrl}
      alt={`Icono de ${appName}`}
      onError={() => setHasImageError(true)}
      className={`${className} object-contain ${
        interactive ? logoInteractionClass : ''
      }`}
    />
  ) : (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-2xl border border-cyan-200/70 bg-slate-950/70 p-1 shadow-[0_16px_34px_rgba(6,182,212,0.24)] dark:border-cyan-400/25 dark:bg-slate-950 ${
        interactive ? logoInteractionClass : ''
      }`}
    >
      <PrysmaMark className={className} />
    </span>
  );

  if (!showWordmark) {
    return (
      iconNode
    );
  }

  return (
    <span className="inline-flex min-w-0 items-center gap-3">
      {iconNode}
      <span
        className={`truncate font-['Segoe_UI',ui-sans-serif,system-ui,sans-serif] text-lg font-semibold tracking-[0.04em] text-slate-900 dark:text-slate-100 ${
          interactive ? logoInteractionClass : ''
        }`}
      >
        {appName}
      </span>
    </span>
  );
}
