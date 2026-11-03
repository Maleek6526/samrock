'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  SaveState,
  dangerButton,
  fieldClass,
  ghostButton,
  labelClass,
  numberFromInput,
  panelClass,
  primaryButton,
} from '@/app/admin/ui';
import ImageField, { ImageListField } from '@/app/admin/ImageField';
import VideoField from '@/app/admin/VideoField';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'url'
  | 'image'
  | 'imageList'
  | 'video'
  | 'date'
  | 'datetime'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'list';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  placeholder?: string;
  /** Spans the full two-column width. */
  full?: boolean;
}

function readField(record: { id: string }, key: string): unknown {
  return (record as unknown as Record<string, unknown>)[key];
}

function FieldInput({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (field.type === 'checkbox') {
    return (
      <div className="flex items-center gap-3 pt-7">
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4"
          style={{ accentColor: 'var(--brand)' }}
        />
        <label htmlFor={id} className="text-sm text-strong">
          {field.label}
        </label>
      </div>
    );
  }

  if (field.type === 'image') {
    return (
      <ImageField
        id={id}
        label={field.label}
        value={value == null ? '' : String(value)}
        onChange={onChange}
        placeholder={field.placeholder}
      />
    );
  }

  if (field.type === 'imageList') {
    return (
      <ImageListField
        id={id}
        label={field.label}
        value={Array.isArray(value) ? (value as string[]) : []}
        onChange={onChange}
      />
    );
  }

  if (field.type === 'video') {
    return (
      <VideoField
        id={id}
        label={field.label}
        value={value == null ? '' : String(value)}
        onChange={onChange}
        placeholder={field.placeholder}
      />
    );
  }

  const text = value == null ? '' : String(value);

  return (
    <>
      <label htmlFor={id} className={labelClass}>
        {field.label}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          id={id}
          rows={4}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          className={`${fieldClass} resize-none`}
        />
      ) : field.type === 'list' ? (
        <textarea
          id={id}
          rows={3}
          value={Array.isArray(value) ? (value as string[]).join('\n') : ''}
          onChange={(event) =>
            onChange(
              event.target.value
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
            )
          }
          placeholder={field.placeholder ?? 'One entry per line'}
          className={`${fieldClass} resize-none`}
        />
      ) : field.type === 'select' ? (
        <select
          id={id}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClass}
        >
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === 'number' ? (
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={text}
          onChange={(event) => onChange(numberFromInput(event.target.value))}
          placeholder={field.placeholder}
          className={fieldClass}
        />
      ) : field.type === 'date' ? (
        <input
          id={id}
          type="date"
          value={text.slice(0, 10)}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClass}
        />
      ) : field.type === 'datetime' ? (
        <input
          id={id}
          type="datetime-local"
          value={text.slice(0, 16)}
          onChange={(event) => onChange(event.target.value)}
          className={fieldClass}
        />
      ) : (
        <input
          id={id}
          type={field.type === 'url' ? 'url' : 'text'}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          className={fieldClass}
        />
      )}
    </>
  );
}

interface CollectionPanelProps<T extends { id: string }> {
  title: string;
  emptyLabel: string;
  addLabel?: string;
  fields: FieldDef[];
  /** Lazy initialiser reading the saved records (called once). */
  initial: () => T[];
  createBlank: () => T;
  onSave: (records: T[]) => void;
  recordTitle: (record: T) => string;
  /** Optional normaliser (e.g. deriving slugs) applied right before saving. */
  beforeSave?: (records: T[]) => T[];
}

/** Generic record editor: identical chrome and behaviour for every collection. */
export default function CollectionPanel<T extends { id: string }>({
  title,
  emptyLabel,
  addLabel = 'Add new',
  fields,
  initial,
  createBlank,
  onSave,
  recordTitle,
  beforeSave,
}: CollectionPanelProps<T>) {
  const [records, setRecords] = useState<T[]>(initial);
  const [saved, setSaved] = useState<T[]>(initial);

  const dirty = useMemo(() => JSON.stringify(records) !== JSON.stringify(saved), [records, saved]);

  const update = (id: string, key: string, value: unknown) => {
    setRecords((current) =>
      current.map((record) => (record.id === id ? ({ ...record, [key]: value } as T) : record))
    );
  };

  const add = () => {
    setRecords((current) => [...current, createBlank()]);
    toast.info('New entry added. Save to publish it.');
  };

  const remove = (id: string) => {
    setRecords((current) => current.filter((record) => record.id !== id));
  };

  const confirmRemove = (id: string) => {
    const record = records.find((item) => item.id === id);
    toast.warning(`Remove "${record ? recordTitle(record) : 'this entry'}"?`, {
      action: { label: 'Remove', onClick: () => remove(id) },
    });
  };

  const save = () => {
    const next = beforeSave ? beforeSave(records) : records;
    onSave(next);
    setRecords(next);
    setSaved(next);
    toast.success(`${title} saved.`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h2 className="font-display text-2xl tracking-tight text-strong">{title}</h2>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <SaveState dirty={dirty} />
          <button type="button" onClick={add} className={`${ghostButton} w-full text-xs sm:w-auto`}>
            <Plus size={18} aria-hidden="true" /> {addLabel}
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty}
            className={`${primaryButton} w-full sm:w-auto`}
          >
            <Save size={18} aria-hidden="true" /> Save
          </button>
        </div>
      </div>

      {records.length === 0 ? (
        <p className="border border-dashed border-hairline bg-surface-2 p-12 text-center text-sm text-silver">
          {emptyLabel}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {records.map((record) => (
            <div key={record.id} className={`${panelClass} space-y-6`}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 sm:gap-8">
                {fields.map((field) => (
                  <div key={field.key} className={`space-y-2 ${field.full ? 'md:col-span-2' : ''}`}>
                    <FieldInput
                      id={`${record.id}-${field.key}`}
                      field={field}
                      value={readField(record, field.key)}
                      onChange={(value) => update(record.id, field.key, value)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-6 border-t border-hairline pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => confirmRemove(record.id)}
                  className={`${dangerButton} w-full text-xs sm:w-auto`}
                >
                  <Trash2 size={16} aria-hidden="true" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
