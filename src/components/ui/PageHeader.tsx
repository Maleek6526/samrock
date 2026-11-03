import React from 'react';

interface PageHeaderProps {
  /** Zero-padded page number, e.g. "01". */
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  /** Optional slot rendered below the headline block (filters, actions, stats). */
  children?: React.ReactNode;
}

/**
 * The numbered rail + display headline + lede that opens an interior page.
 * Mirrors SectionHeading so pages and home sections read as one system.
 */
export default function PageHeader({ index, eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <header className="border-t border-hairline pt-5">
      <div className="flex items-baseline gap-4">
        <span className="eyebrow text-brand">{index}</span>
        <span className="eyebrow text-silver">{eyebrow}</span>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-12 md:gap-10">
        <h1 className="font-display text-display text-strong md:col-span-7">{title}</h1>
        {description ? (
          <p className="text-lede text-silver md:col-span-5 md:pt-3">{description}</p>
        ) : null}
      </div>

      {children ? <div className="mt-10">{children}</div> : null}
    </header>
  );
}
