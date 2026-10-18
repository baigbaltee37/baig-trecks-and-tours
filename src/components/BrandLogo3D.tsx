import React from 'react';
import { BrandLogo, BrandLogoProps } from './BrandLogo';

export interface BrandLogo3DProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

/**
 * Backward compatibility wrapper forwarding to new Karakoram BrandLogo system
 */
export const BrandLogo3D: React.FC<BrandLogo3DProps> = ({
  size = 'md',
  variant = 'light',
}) => {
  return (
    <BrandLogo
      layout="horizontal"
      size={size}
      variant={variant}
      showTagline={true}
    />
  );
};

export { BrandLogo };
