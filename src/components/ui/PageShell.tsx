import React from 'react';

/**
 * Consistent frame for every interior page: clears the fixed navbar (5rem / 6rem)
 * and centres the content on the same 7xl rail the home page uses.
 */
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-surface px-6 pb-28 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-7xl">{children}</div>
    </main>
  );
}
