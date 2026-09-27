import React from 'react';

interface BrandLogo3DProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

/**
 * Modern Mountain "B" Logo — Emerald-800 (#065f46) + "Baig Treks & Tours"
 * Combines a geometric mountain peak silhouette seamlessly integrated with a bold modern monogram "B".
 */
export const BrandLogo3D: React.FC<BrandLogo3DProps> = ({
  size = 'md',
  variant = 'light',
}) => {
  const iconDimensions =
    size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-11 h-11' : 'w-10 h-10';
  const textClass =
    size === 'sm'
      ? 'text-base sm:text-lg'
      : size === 'lg'
      ? 'text-xl sm:text-2xl'
      : 'text-lg sm:text-xl';

  const textColor = variant === 'dark' ? 'text-white' : 'text-slate-900';

  return (
    <span className="group inline-flex items-center gap-2.5 sm:gap-3 select-none">
      {/* Modern Emerald-800 Mountain "B" Emblem */}
      <span
        className={`relative ${iconDimensions} rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-900/20 border border-emerald-700/80 transition-transform duration-300 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 64 64"
          className="w-4/5 h-4/5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Subtle Twin Mountain Peaks Rising Behind/Inside the Monogram B */}
          <path
            d="M12 46L25 22L34 36L41 26L52 46H12Z"
            fill="rgba(255,255,255,0.18)"
          />
          <path
            d="M14 44L25 24L33 36L41 26L50 44"
            stroke="#A7F3D0"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Bold Modern Geometric "B" Monogram Fused with Mountain Ridge */}
          <path
            d="M20 14H35C41.0751 14 46 18.4772 46 24C46 27.8 43.7 31.1 40.2 32.6C44.5 34.1 47.5 37.9 47.5 42.5C47.5 48.8513 42.1274 54 35.5 54H20V14Z"
            stroke="#FFFFFF"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Middle Mountain Horizon Bar of the "B" */}
          <path
            d="M20 33H33.5L37 29.5L40.5 33"
            stroke="#6EE7B7"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Snow Cap Accent Dot */}
          <circle cx="25" cy="19" r="2" fill="#6EE7B7" />
        </svg>
      </span>

      {/* Brand Wordmark: Baig Treks & Tours */}
      <span className="flex flex-col leading-none">
        <span
          className={`font-display ${textClass} font-bold tracking-tight ${textColor} whitespace-nowrap`}
        >
          Baig Treks &amp; Tours
        </span>
        <span
          className={`text-[10px] font-semibold tracking-wide ${
            variant === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Gilgit-Baltistan
        </span>
      </span>
    </span>
  );
};
