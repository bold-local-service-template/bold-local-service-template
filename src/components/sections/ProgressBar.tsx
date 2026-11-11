import React from 'react';

interface ProgressBarProps {
  scrollProgress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ scrollProgress }) => {
  return (
    <div
      id="pg"
      style={{ width: `${Math.max(0, Math.min(100, scrollProgress))}%` }}
      aria-hidden="true"
    />
  );
};
