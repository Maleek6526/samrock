import React from 'react';

interface SectionHeadingProps {
  /** Zero-padded section number, e.g. "01". Acts as the anchor for the heading
      now that the decorative pill and icon have gone. */
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
}

/**
 * The numbered label rail + display headline + lede that opens every section.
 * Deliberately asymmetric: the headline holds the left seven columns and the
 * lede the right five, so the page never settles into a centred stack.
 */
export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <header className="border-t border-hairline pt-5">
      <div className="flex items-baseline gap-4">
        <span className="eyebrow text-brand">{index}</span>
        <span className="eyebrow text-silver">{eyebrow}</span>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-12 md:gap-10">
        <h2 className="font-display text-display text-strong md:col-span-7">{title}</h2>
        {description ? (
          <p className="text-lede text-silver md:col-span-5 md:pt-3">{description}</p>
        ) : null}
      </div>
    </header>
  );
}
