'use client';

import React, { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { toast } from 'sonner';

/** Shares the current page with the Web Share API, falling back to a clipboard copy. */
export default function ShareLink({
  url,
  title,
  label = 'Share',
}: {
  url: string;
  title: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl =
      typeof window !== 'undefined' ? new URL(url, window.location.origin).toString() : url;

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard.');
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // The share sheet was dismissed or the clipboard was blocked; nothing to do.
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="link-underline eyebrow inline-flex items-center gap-2 text-brand"
    >
      {copied ? <Check size={12} aria-hidden="true" /> : <Share2 size={12} aria-hidden="true" />}
      {copied ? 'Copied' : label}
    </button>
  );
}
