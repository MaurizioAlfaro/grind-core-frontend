
import React, { useState } from 'react';
import type { Item } from '../../types';

interface ItemIconProps {
  item: Item | undefined | null;
  className?: string; // For emoji span
  imgClassName?: string; // For img tag
}

// A default icon for when an image is specified but fails to load.
const DefaultIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);


export const ItemIcon: React.FC<ItemIconProps> = ({ item, className, imgClassName }) => {
  const [hasError, setHasError] = useState(false);

  if (!item) {
      return <DefaultIcon className={imgClassName} />;
  }

  if (item.image && !hasError) {
      return (
          <img 
              src={item.image} 
              alt={item.name} 
              className={imgClassName}
              onError={() => setHasError(true)}
          />
      );
  }
  
  // Fallback for when image is not present or fails to load.
  if (item.image && hasError) {
      return <DefaultIcon className={imgClassName} />;
  }

  // If no image is defined, use emoji.
  return <span className={className}>{item.icon}</span>;
};
