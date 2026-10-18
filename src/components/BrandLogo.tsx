import React from 'react';

export type LogoLayout = 'horizontal' | 'stacked' | 'emblem';
export type LogoVariant = 'dark' | 'light' | 'single-color';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface BrandLogoProps {
  layout?: LogoLayout;
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  showTagline?: boolean;
}

/**
 * Karakoram Peak SVG Emblem
 * Deliberate, razor-sharp geometric mountain geometry inspired by K2 & Passu Cones.
 * Features faceted left/right mountain ridge shading with Forest Green (#183C30),
 * Mountain Gold (#B99A58), Deep Pine (#24342D), and Warm Ivory (#F4EFDF).
 */
export const MountainEmblemSVG: React.FC<{
  sizeClass?: string;
  variant?: LogoVariant;
  className?: string;
}> = ({ sizeClass = 'w-10 h-10', variant = 'light', className = '' }) => {
  const isSingle = variant === 'single-color';
  const isDark = variant === 'dark';

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeClass} shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Baig Treks & Tours Karakoram Emblem"
    >
      {/* Outer subtle shield container */}
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="22"
        fill={
          isSingle
            ? 'currentColor'
            : isDark
            ? '#183C30'
            : '#24342D'
        }
        fillOpacity={isSingle ? 0.08 : 1}
        stroke={
          isSingle
            ? 'currentColor'
            : '#B99A58'
        }
        strokeWidth="2.5"
        strokeOpacity={isSingle ? 0.3 : 0.85}
      />

      {/* Main K2 / Karakoram Pyramid Peak (Center) */}
      {/* Left Shadow Facet */}
      <path
        d="M50 18L18 72H50V18Z"
        fill={isSingle ? 'currentColor' : '#0F261F'}
        fillOpacity={isSingle ? 0.85 : 1}
      />
      {/* Right Sunlit Facet (Mountain Gold) */}
      <path
        d="M50 18L82 72H50V18Z"
        fill={isSingle ? 'currentColor' : '#B99A58'}
        fillOpacity={isSingle ? 0.6 : 1}
      />

      {/* Razor-sharp Glacial Ridge Line */}
      <path
        d="M50 18V72"
        stroke={isSingle ? '#FFFFFF' : '#F4EFDF'}
        strokeWidth="1.75"
        strokeLinecap="round"
      />

      {/* Pure Snow Cap Crest */}
      <path
        d="M50 18L38 38L44 36L50 42L56 36L62 38L50 18Z"
        fill={isSingle ? '#FFFFFF' : '#FFFFFF'}
      />

      {/* Secondary Foreground Ridge (Passu Spire / Karakoram Spur) */}
      {/* Left facet */}
      <path
        d="M32 44L14 74H36L32 44Z"
        fill={isSingle ? 'currentColor' : '#183C30'}
        fillOpacity={isSingle ? 0.7 : 0.95}
      />
      {/* Right facet */}
      <path
        d="M32 44L46 74H36L32 44Z"
        fill={isSingle ? 'currentColor' : '#D4AF37'}
        fillOpacity={isSingle ? 0.5 : 0.9}
      />

      {/* Eastern Twin Horn Peak */}
      <path
        d="M68 44L56 74H74L68 44Z"
        fill={isSingle ? 'currentColor' : '#24342D'}
        fillOpacity={isSingle ? 0.7 : 0.95}
      />
      <path
        d="M68 44L84 74H74L68 44Z"
        fill={isSingle ? 'currentColor' : '#A38443'}
        fillOpacity={isSingle ? 0.5 : 0.9}
      />

      {/* Mountain Base Horizon Bar (Gold Accent) */}
      <path
        d="M16 76H84"
        stroke={isSingle ? 'currentColor' : '#B99A58'}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Karakoram Latitude Star / Compass Accent */}
      <circle
        cx="50"
        cy="83"
        r="2.5"
        fill={isSingle ? 'currentColor' : '#B99A58'}
      />
      <path
        d="M44 83H47M53 83H56"
        stroke={isSingle ? 'currentColor' : '#B99A58'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  layout = 'horizontal',
  variant = 'light',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  const emblemSizes = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const titleSizes = {
    xs: 'text-xs',
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const subSizes = {
    xs: 'text-[8px]',
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const isDark = variant === 'dark';
  const isSingle = variant === 'single-color';

  const textColor = isSingle
    ? 'text-current'
    : isDark
    ? 'text-white'
    : 'text-[#183C30]';

  const goldAccentColor = isSingle
    ? 'text-current opacity-80'
    : isDark
    ? 'text-[#B99A58]'
    : 'text-[#927536]';

  const subColor = isSingle
    ? 'text-current opacity-70'
    : isDark
    ? 'text-[#F4EFDF]/80'
    : 'text-[#24342D]/75';

  if (layout === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <MountainEmblemSVG
          sizeClass={emblemSizes[size]}
          variant={variant}
        />
      </div>
    );
  }

  if (layout === 'stacked') {
    return (
      <div
        className={`inline-flex flex-col items-center text-center select-none ${className}`}
      >
        <MountainEmblemSVG
          sizeClass={emblemSizes[size]}
          variant={variant}
          className="mb-3 transition-transform duration-300 hover:scale-105"
        />
        <div className="flex flex-col items-center">
          <span
            className={`font-serif ${titleSizes[size]} font-bold tracking-wider uppercase ${textColor} leading-tight`}
          >
            BAIG TREKS &amp; TOURS
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-4 h-[1px] bg-[#B99A58]/60" />
            <span
              className={`${subSizes[size]} uppercase tracking-[0.22em] font-medium ${goldAccentColor}`}
            >
              GILGIT-BALTISTAN
            </span>
            <span className="w-4 h-[1px] bg-[#B99A58]/60" />
          </div>
          {showTagline && (
            <span
              className={`${subSizes[size]} font-normal tracking-wide mt-1 italic ${subColor}`}
            >
              Beyond the Mountains. Discover Gilgit-Baltistan.
            </span>
          )}
        </div>
      </div>
    );
  }

  // Horizontal Layout (Default for Navbar Header)
  return (
    <div
      className={`inline-flex items-center gap-3 select-none group ${className}`}
    >
      <MountainEmblemSVG
        sizeClass={emblemSizes[size]}
        variant={variant}
        className="transition-transform duration-300 group-hover:scale-105"
      />
      <div className="flex flex-col leading-none">
        <span
          className={`font-serif ${titleSizes[size]} font-bold tracking-[0.06em] uppercase ${textColor} whitespace-nowrap transition-colors`}
        >
          BAIG TREKS &amp; TOURS
        </span>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className={`${subSizes[size]} uppercase tracking-[0.2em] font-semibold ${goldAccentColor} whitespace-nowrap`}
          >
            GILGIT-BALTISTAN
          </span>
          {showTagline && (
            <>
              <span className="text-[#B99A58]/60 text-[9px]">•</span>
              <span
                className={`${subSizes[size]} tracking-wider uppercase font-medium ${subColor} hidden sm:inline whitespace-nowrap`}
              >
                PAKISTAN
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
