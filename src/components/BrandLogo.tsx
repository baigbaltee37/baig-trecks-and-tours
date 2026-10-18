import React, { useState } from 'react';
import baigLogoImg from '../assets/images/baig_logo_transparent.png';

export type LogoLayout = 'horizontal' | 'stacked' | 'emblem';
export type LogoVariant = 'dark' | 'light' | 'single-color';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface BrandLogoProps {
  layout?: LogoLayout;
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  showTagline?: boolean;
  usePhotoEmblem?: boolean;
}

/**
 * Minimalist Mountain-and-Trail Vector Fallback Emblem
 */
export const MountainTrailEmblemSVG: React.FC<{
  sizeClass?: string;
  variant?: LogoVariant;
  className?: string;
}> = ({ sizeClass = 'w-10 h-10', variant = 'light', className = '' }) => {
  const isSingle = variant === 'single-color';
  const isDark = variant === 'dark';

  const containerBg = isSingle ? 'currentColor' : isDark ? '#102B24' : '#F8F6F0';
  const containerBorder = isSingle ? 'currentColor' : isDark ? '#C5A46D' : '#174734';
  const primaryPeakLeft = isSingle ? 'currentColor' : isDark ? '#FFFFFF' : '#174734';
  const primaryPeakRight = isSingle ? 'currentColor' : isDark ? '#C5A46D' : '#C5A46D';
  const secondaryPeak = isSingle ? 'currentColor' : isDark ? '#091A16' : '#A8B9A0';
  const trailColor = isSingle ? 'currentColor' : '#C5A46D';

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeClass} shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Baig Treks & Tours Mountain Emblem"
    >
      <rect
        x="3"
        y="3"
        width="94"
        height="94"
        rx="22"
        fill={containerBg}
        fillOpacity={isSingle ? 0.08 : 1}
        stroke={containerBorder}
        strokeWidth="2"
        strokeOpacity={isSingle ? 0.35 : 0.9}
      />
      <circle cx="72" cy="32" r="8" fill={trailColor} fillOpacity={isSingle ? 0.25 : 0.35} />
      <path d="M20 74L38 42L54 74H20Z" fill={secondaryPeak} fillOpacity={isSingle ? 0.6 : 1} />
      <path d="M44 74L64 26L84 74H44Z" fill={primaryPeakRight} />
      <path d="M44 74L64 26L54 74H44Z" fill={primaryPeakLeft} />
      <path
        d="M26 84C38 77 48 77 62 68C72 61 76 54 82 48"
        stroke={trailColor}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 84H84" stroke={trailColor} strokeWidth="2" strokeLinecap="round" strokeOpacity={0.8} />
    </svg>
  );
};

/**
 * High-Resolution Photo Emblem based on the uploaded picture
 * Features the alpine explorer in the green Karakoram valley with mountain livestock.
 */
export const BaigBrandLogoImage: React.FC<{
  sizeClass?: string;
  className?: string;
  variant?: LogoVariant;
}> = ({ sizeClass = 'w-10 h-10', className = '', variant = 'light' }) => {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return <MountainTrailEmblemSVG sizeClass={sizeClass} variant={variant} className={className} />;
  }

  return (
    <div
      className={`${sizeClass} shrink-0 relative flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${className}`}
    >
      <img
        src={baigLogoImg}
        alt="Baig Treks & Tours Emblem"
        onError={() => setImgError(true)}
        className="w-full h-full object-contain object-center select-none filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
      />
    </div>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  layout = 'horizontal',
  variant = 'light',
  size = 'md',
  className = '',
  showTagline = true,
  usePhotoEmblem = true,
}) => {
  const emblemSizes = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10 sm:w-11 sm:h-11',
    md: 'w-12 h-12 sm:w-13 sm:h-13',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
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

  const textColor = isSingle ? 'text-current' : isDark ? 'text-white' : 'text-[#174734]';
  const accentColor = isSingle ? 'text-current opacity-90' : isDark ? 'text-[#C5A46D]' : 'text-[#A88647]';
  const subColor = isSingle ? 'text-current opacity-70' : isDark ? 'text-white/70' : 'text-[#5A655F]';

  const renderEmblem = () => {
    if (usePhotoEmblem) {
      return <BaigBrandLogoImage sizeClass={emblemSizes[size]} variant={variant} />;
    }
    return <MountainTrailEmblemSVG sizeClass={emblemSizes[size]} variant={variant} />;
  };

  if (layout === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderEmblem()}
      </div>
    );
  }

  if (layout === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center text-center select-none ${className}`}>
        <div className="mb-2 transition-transform duration-300 hover:scale-105">
          {renderEmblem()}
        </div>
        <div className="flex flex-col items-center">
          <span className={`font-serif ${titleSizes[size]} font-bold tracking-[0.05em] uppercase ${textColor} leading-tight`}>
            BAIG TREKS &amp; TOURS
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-3 h-[1px] ${isDark ? 'bg-[#C5A46D]/60' : 'bg-[#174734]/30'}`} />
            <span className={`${subSizes[size]} uppercase tracking-[0.22em] font-semibold ${accentColor}`}>
              GILGIT-BALTISTAN · PAKISTAN
            </span>
            <span className={`w-3 h-[1px] ${isDark ? 'bg-[#C5A46D]/60' : 'bg-[#174734]/30'}`} />
          </div>
          {showTagline && (
            <span className={`${subSizes[size]} font-normal tracking-wide mt-1 ${subColor}`}>
              Handcrafted Mountain Journeys &amp; Expeditions
            </span>
          )}
        </div>
      </div>
    );
  }

  // Horizontal Layout (Standard for Navbar Header)
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none group ${className}`}>
      {renderEmblem()}
      <div className="flex flex-col leading-none">
        <span
          className={`font-serif ${titleSizes[size]} font-bold tracking-[0.05em] uppercase ${textColor} whitespace-nowrap transition-colors`}
        >
          BAIG TREKS &amp; TOURS
        </span>
        <div className="flex items-center gap-1.5 mt-1">
          <span className={`${subSizes[size]} uppercase tracking-[0.2em] font-semibold ${accentColor} whitespace-nowrap`}>
            NORTHERN PAKISTAN
          </span>
          {showTagline && (
            <>
              <span className={`${isDark ? 'text-white/30' : 'text-[#174734]/30'} text-[9px]`}>•</span>
              <span className={`${subSizes[size]} tracking-wider uppercase font-medium ${subColor} hidden sm:inline whitespace-nowrap`}>
                HUNZA &amp; SKARDU
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
