'use client';

import React, { useId, useRef, useState } from 'react';
import { ImagePlus, Link2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { dangerButton, fieldClass, ghostButton, labelClass } from '@/app/admin/ui';

/** Longest edge an uploaded image is resized to before it is stored. */
const MAX_DIMENSION = 1600;
/** Encode quality for the resized upload. */
const OUTPUT_QUALITY = 0.85;
/** Roughly where a single image starts to strain the localStorage quota. */
const WARN_BYTES = 1_400_000;

const ACCEPTED_TYPES = 'image/png,image/jpeg,image/webp,image/gif,image/avif';

function isDataUrl(value: string) {
  return value.startsWith('data:');
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file);
  }
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Image failed to load'));
    };
    image.src = objectUrl;
  });
}

/**
 * There is no server upload in this project, so a device image is downscaled
 * on a canvas and stored as a data URL. The resize keeps it small enough for
 * localStorage and lets `next/image` render it without any config changes.
 */
async function optimiseImageFile(file: File): Promise<string> {
  const source = await loadBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(source.width, source.height));
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable in this browser.');
  context.drawImage(source, 0, 0, width, height);
  if ('close' in source) source.close();

  // WebP keeps transparency and compresses well; browsers without an encoder
  // silently return a PNG, in which case JPEG is the smaller fallback.
  const webp = canvas.toDataURL('image/webp', OUTPUT_QUALITY);
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', OUTPUT_QUALITY);
}

/** Shared import pipeline for single and multi-file pickers. */
function useImageImport() {
  const [busy, setBusy] = useState(false);

  const importFiles = async (fileList: FileList | null, onDone: (dataUrls: string[]) => void) => {
    const files = fileList ? Array.from(fileList) : [];
    const images = files.filter((file) => file.type.startsWith('image/'));
    if (images.length === 0) {
      toast.error('Choose an image file (JPG, PNG, WebP, GIF or AVIF).');
      return;
    }

    setBusy(true);
    try {
      const dataUrls: string[] = [];
      for (const file of images) {
        dataUrls.push(await optimiseImageFile(file));
      }
      onDone(dataUrls);
      if (dataUrls.some((url) => url.length > WARN_BYTES)) {
        toast.warning('That image is large and may not fit in local storage. A hosted link is safer.');
      } else {
        toast.success(
          dataUrls.length > 1 ? `${dataUrls.length} images added.` : 'Image added from your device.'
        );
      }
    } catch (error) {
      console.error(error);
      toast.error('Could not read that image. Try a different file.');
    } finally {
      setBusy(false);
    }
  };

  return { busy, importFiles };
}

function UploadButton({
  label,
  busy,
  multiple,
  onSelect,
}: {
  label: string;
  busy: boolean;
  multiple?: boolean;
  onSelect: (files: FileList | null) => void;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className={`${ghostButton} shrink-0 text-xs disabled:opacity-50`}
      >
        <ImagePlus size={16} aria-hidden="true" /> {busy ? 'Reading...' : label}
      </button>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple={multiple}
        aria-label={label}
        className="sr-only"
        onChange={(event) => {
          onSelect(event.target.files);
          // Reset so picking the same file again still fires a change event.
          event.target.value = '';
        }}
      />
    </>
  );
}

const hintClass = 'text-xs leading-relaxed text-silver';

export interface ImageFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}

/** Single image: paste a hosted link, or upload one from this device. */
export default function ImageField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
}: ImageFieldProps) {
  const { busy, importFiles } = useImageImport();
  const uploaded = isDataUrl(value);

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
              uploaded ? 'Image uploaded from this device' : placeholder ?? 'Paste an image link...'
            }
            className={`${fieldClass} pl-10`}
          />
        </div>
        <UploadButton
          label="Choose file"
          busy={busy}
          onSelect={(files) => void importFiles(files, ([url]) => onChange(url))}
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
        <div className="flex items-center gap-3 pt-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-16 w-16 rounded-xs border border-hairline bg-surface-2 object-cover"
          />
          <span className={hintClass}>
            {uploaded ? 'Uploaded from this device.' : 'Preview from the pasted link.'}
          </span>
        </div>
      ) : (
        <p className={hintClass}>
          {hint ?? 'Paste a hosted link, or upload a file from your device.'}
        </p>
      )}
    </div>
  );
}

export interface ImageListFieldProps {
  id: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
}

/** Multiple images (galleries): one link per line, plus multi-file upload. */
export function ImageListField({ id, label, value, onChange, hint }: ImageListFieldProps) {
  const { busy, importFiles } = useImageImport();

  const remove = (index: number) => {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>

      <textarea
        id={id}
        rows={3}
        value={value.join('\n')}
        onChange={(event) =>
          onChange(
            event.target.value
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
          )
        }
        placeholder="One image link per line, or upload files below..."
        className={`${fieldClass} resize-none`}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <UploadButton
          label="Add images"
          busy={busy}
          multiple
          onSelect={(files) => void importFiles(files, (urls) => onChange([...value, ...urls]))}
        />
        {value.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange([])}
            className={`${dangerButton} shrink-0 text-xs`}
          >
            <Trash2 size={16} aria-hidden="true" /> Clear all
          </button>
        ) : null}
        <p className={hintClass}>{hint ?? 'Uploads are resized automatically before saving.'}</p>
      </div>

      {value.length > 0 ? (
        <ul className="grid grid-cols-3 gap-3 pt-1 sm:grid-cols-5">
          {value.map((src, index) => (
            <li key={`${src.slice(0, 32)}-${index}`} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="aspect-square w-full rounded-xs border border-hairline bg-surface-2 object-cover"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove image ${index + 1}`}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-xs border border-hairline bg-surface/90 text-danger transition hover:border-danger hover:bg-danger/10"
              >
                <Trash2 size={12} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
