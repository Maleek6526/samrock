import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface SectionHeadingProps {
  eyebrow: string;
  icon?: LucideIcon;
  title: React.ReactNode;
  description?: string;
  className?: string;
}

/**
 * The eyebrow pill + gradient headline + description block that every section
 * previously duplicated.
 */
export default function SectionHeading({
  eyebrow,
  icon: Icon,
  title,
  description,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`text-center space-y-3 ${className}`}>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-2 border border-brand/30 text-xs font-semibold text-brand uppercase tracking-widest">
        {Icon ? <Icon size={14} aria-hidden="true" /> : null}
        {eyebrow}
      </div>

      <h2 className="text-3xl sm:text-5xl font-extrabold text-strong tracking-tight">
        {title}
      </h2>

      {description ? (
        <p className="max-w-xl mx-auto text-silver text-sm sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
