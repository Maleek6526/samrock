'use client';

import React, { useId, useRef, useState } from 'react';
import { Link2, Trash2, Video } from 'lucide-react';
import { toast } from 'sonner';
import { dangerButton, fieldClass, ghostButton, labelClass } from '@/app/admin/ui';
import { getVideoFileUrl, getYouTubeEmbedUrl } from '@/lib/embeds';

/**
 * Uploads live in localStorage (there is no server), so a clip that is too
 * large to persist is refused up front rather than silently breaking the store.
 */
const MAX_VIDEO_BYTES = 3_000_000;
const WARN_BYTES = 1_500_000;

const ACCEPTED_TYPES = 'video/mp4,video/webm,video/ogg,video/quicktime';

const hintClass = 'text-xs leading-relaxed text-silver';

function formatSize(bytes: number) {
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

function readVideoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Video failed to load'));
    reader.readAsDataURL(file);
  });
}

export interface VideoFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}

/** A video: paste a YouTube / file link, or upload a clip from this device. */
export default function VideoField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
}: VideoFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const uploaded = value.startsWith('data:') || value.startsWith('blob:');
  const embed = value ? getYouTubeEmbedUrl(value) : null;
  const fileSource = value ? getVideoFileUrl(value) : null;

  const importFile = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Choose a video file (MP4, WebM, OGG or MOV).');
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      toast.error(
        `That clip is ${formatSize(file.size)}. Keep device uploads under ${formatSize(
          MAX_VIDEO_BYTES
        )} or paste a YouTube link instead.`
      );
      return;
    }

    setBusy(true);
    try {
      onChange(await readVideoFile(file));
      if (file.size > WARN_BYTES) {
        toast.warning(
          'Large clip added. Device uploads are stored in this browser and may not fit alongside other content.'
        );
      } else {
        toast.success('Video added from your device.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Could not read that video. Try a different file.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Link2
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-silver"
            aria-hidden="true"
          />
          <input
            id={id}
            type="text"
            value={uploaded ? '' : value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={
              uploaded ? 'Video uploaded from this device' : placeholder ?? 'Paste a YouTube or video link...'
            }
            className={`${fieldClass} pl-10`}
          />
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={`${ghostButton} shrink-0 text-xs disabled:opacity-50`}
        >
          <Video size={16} aria-hidden="true" /> {busy ? 'Reading...' : 'Choose video'}
        </button>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          aria-label={label}
          className="sr-only"
          onChange={(event) => {
            void importFile(event.target.files);
            // Reset so picking the same file again still fires a change event.
            event.target.value = '';
          }}
        />

        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className={`${dangerButton} shrink-0 text-xs`}
          >
            <Trash2 size={16} aria-hidden="true" /> Clear
          </button>
        ) : null}
      </div>

      {value ? (
        <div className="space-y-2 pt-1">
          <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-xs border border-hairline bg-surface-2">
            {embed ? (
              <iframe
                src={embed}
                title={label}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : fileSource ? (
              <video
                src={fileSource}
                controls
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center text-brand"
              >
                <Link2 size={22} aria-hidden="true" />
              </a>
            )}
          </div>
          <p className={hintClass}>
            {uploaded
              ? 'Uploaded from this device.'
              : embed
                ? 'YouTube video linked.'
                : 'Preview from the pasted link.'}
          </p>
        </div>
      ) : (
        <p className={hintClass}>
          {hint ?? 'Paste a YouTube link, or upload a clip from your device.'}
        </p>
      )}
    </div>
  );
}
