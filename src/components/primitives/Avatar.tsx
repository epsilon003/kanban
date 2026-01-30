import React from 'react';
import clsx from 'clsx';
import { getInitials } from '@/utils/task.utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  
  return (
    <div
      className={clsx(
        'bg-primary-500 rounded-full text-white flex items-center justify-center font-medium',
        sizes[size],
        className
      )}
      aria-label={`Avatar for ${name}`}
    >
      {getInitials(name)}
    </div>
  );
};