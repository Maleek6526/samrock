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
  panelClass,
  primaryButton,
} from '@/app/admin/ui';
import ImageField, { ImageListField } from '@/app/admin/ImageField';
import { type ContentSettings } from '@/lib/site';
import { readContentSettings, saveContentSettings } from '@/lib/store';

type StringMap = Record<string, string>;

function ListEditor({
  label,
  addLabel,
  items,
  fields,
  blank,
  onChange,
}: {
  label: string;
  addLabel: string;
  items: StringMap[];
  fields: { key: string; label: string; textarea?: boolean }[];
  blank: StringMap;
  onChange: (items: StringMap[]) => void;
}) {
  const updateItem = (index: number, key: string, value: string) =>
    onChange(items.map((item, position) => (position === index ? { ...item, [key]: value } : item)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <span className={labelClass}>{label}</span>
        <button type="button" onClick={() => onChange([...items, blank])} className={`${ghostButton} text-xs`}>
          <Plus size={14} aria-hidden="true" /> {addLabel}
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={`${label}-${index}`}
            className="grid grid-cols-1 gap-4 border border-hairline bg-surface-2 p-4 md:grid-cols-2"
          >
            {fields.map((field) => (
              <div key={field.key} className={`space-y-2 ${field.textarea ? 'md:col-span-2' : ''}`}>
                <label className={labelClass}>{field.label}</label>
                {field.textarea ? (
                  <textarea
                    rows={2}
                    value={item[field.key] ?? ''}
                    onChange={(event) => updateItem(index, field.key, event.target.value)}
                    className={`${fieldClass} resize-none`}
                  />
                ) : (
                  <input
                    type="text"
                    value={item[field.key] ?? ''}
                    onChange={(event) => updateItem(index, field.key, event.target.value)}
                    className={fieldClass}
                  />
                )}
              </div>
            ))}
            <div className="flex justify-end md:col-span-2">
              <button
                type="button"
                onClick={() => onChange(items.filter((_, position) => position !== index))}
                className={`${dangerButton} text-xs`}
              >
                <Trash2 size={14} aria-hidden="true" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className={labelClass}>{label}</label>
      <textarea
        rows={4}
        value={items.join('\n')}
        onChange={(event) =>
          onChange(
            event.target.value
              .split('\n')
              .map((line) => line.trim())
              .filter(Boolean)
          )
        }
        placeholder={placeholder ?? 'One entry per line'}
        className={`${fieldClass} resize-none`}
      />
    </div>
  );
}

/** Edits every piece of long-form site copy held in `ContentSettings`. */
export default function ContentPanel() {
  const [content, setContent] = useState<ContentSettings>(readContentSettings);
  const [saved, setSaved] = useState<ContentSettings>(readContentSettings);

  const dirty = useMemo(() => JSON.stringify(content) !== JSON.stringify(saved), [content, saved]);

  const updateAbout = (patch: Partial<ContentSettings['about']>) =>
    setContent((current) => ({ ...current, about: { ...current.about, ...patch } }));
  const updateFounder = (patch: Partial<ContentSettings['founder']>) =>
    setContent((current) => ({ ...current, founder: { ...current.founder, ...patch } }));
  const updateContact = (patch: Partial<ContentSettings['contact']>) =>
    setContent((current) => ({ ...current, contact: { ...current.contact, ...patch } }));
  const updateImagery = (patch: Partial<ContentSettings['imagery']>) =>
    setContent((current) => ({ ...current, imagery: { ...current.imagery, ...patch } }));

  const handleSave = () => {
    saveContentSettings(content);
    setSaved(content);
    toast.success('Site content saved.');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h2 className="font-display text-2xl tracking-tight text-strong">Site Content</h2>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <SaveState dirty={dirty} />
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty}
            className={`${primaryButton} w-full sm:w-auto`}
          >
            <Save size={18} aria-hidden="true" /> Save Content
          </button>
        </div>
      </div>

      {/* About */}
      <section className={`${panelClass} space-y-6`}>
        <h3 className="border-b border-hairline pb-4 font-display text-xl text-strong">About</h3>

        <div className="space-y-2">
          <label className={labelClass}>Studio introduction</label>
          <textarea
            rows={3}
            value={content.about.intro}
            onChange={(event) => updateAbout({ intro: event.target.value })}
            className={`${fieldClass} resize-none`}
          />
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Label story title</label>
          <input
            type="text"
            value={content.about.labelStory.title}
            onChange={(event) =>
              updateAbout({ labelStory: { ...content.about.labelStory, title: event.target.value } })
            }
            className={fieldClass}
          />
        </div>

        <StringListEditor
          label="Label story paragraphs (one per line)"
          items={content.about.labelStory.body}
          onChange={(items) => updateAbout({ labelStory: { ...content.about.labelStory, body: items } })}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 sm:gap-8">
          <div className="space-y-2">
            <label className={labelClass}>Vision title</label>
            <input
              type="text"
              value={content.about.visionTitle}
              onChange={(event) => updateAbout({ visionTitle: event.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Vision body</label>
            <textarea
              rows={2}
              value={content.about.visionBody}
              onChange={(event) => updateAbout({ visionBody: event.target.value })}
              className={`${fieldClass} resize-none`}
            />
          </div>
        </div>

        <ListEditor
          label="Pillars"
          addLabel="Add pillar"
          items={content.about.pillars as unknown as StringMap[]}
          fields={[
            { key: 'title', label: 'Title' },
            { key: 'description', label: 'Description' },
          ]}
          blank={{ title: '', description: '' }}
          onChange={(items) =>
            updateAbout({ pillars: items as unknown as ContentSettings['about']['pillars'] })
          }
        />

        <ListEditor
          label="Milestones"
          addLabel="Add milestone"
          items={content.about.milestones as unknown as StringMap[]}
          fields={[
            { key: 'year', label: 'Year' },
            { key: 'text', label: 'Milestone', textarea: true },
          ]}
          blank={{ year: '', text: '' }}
          onChange={(items) =>
            updateAbout({ milestones: items as unknown as ContentSettings['about']['milestones'] })
          }
        />

        <ListEditor
          label="Studio stats"
          addLabel="Add stat"
          items={content.about.stats as unknown as StringMap[]}
          fields={[
            { key: 'value', label: 'Value' },
            { key: 'label', label: 'Label' },
          ]}
          blank={{ value: '', label: '' }}
          onChange={(items) =>
            updateAbout({ stats: items as unknown as ContentSettings['about']['stats'] })
          }
        />
      </section>

      {/* Studio imagery */}
      <section className={`${panelClass} space-y-6`}>
        <h3 className="border-b border-hairline pb-4 font-display text-xl text-strong">
          Studio Imagery
        </h3>

        <ImageListField
          id="hero-images"
          label="Home hero slideshow"
          value={content.imagery.heroImages}
          onChange={(value) => updateImagery({ heroImages: value })}
          hint="Paste image links or upload files. These rotate behind the home headline."
        />

        <ImageListField
          id="studio-gallery"
          label="Studio gallery"
          value={content.imagery.studioGallery}
          onChange={(value) => updateImagery({ studioGallery: value })}
          hint="Shown in the 'Inside Samrock' section. Leave empty to hide the gallery."
        />
      </section>

      {/* Founder */}
      <section className={`${panelClass} space-y-6`}>
        <h3 className="border-b border-hairline pb-4 font-display text-xl text-strong">Founder</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 sm:gap-8">
          <div className="space-y-2">
            <label className={labelClass}>Name</label>
            <input
              type="text"
              value={content.founder.name}
              onChange={(event) => updateFounder({ name: event.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Role</label>
            <input
              type="text"
              value={content.founder.role}
              onChange={(event) => updateFounder({ role: event.target.value })}
              className={fieldClass}
            />
          </div>
          <ImageField
            id="founder-photo"
            label="Photo"
            value={content.founder.photo}
            onChange={(value) => updateFounder({ photo: value })}
          />
          <div className="space-y-2">
            <label className={labelClass}>Phone</label>
            <input
              type="tel"
              value={content.founder.phone}
              onChange={(event) => updateFounder({ phone: event.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={content.founder.email}
              onChange={(event) => updateFounder({ email: event.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Instagram</label>
            <input
              type="url"
              value={content.founder.instagram}
              onChange={(event) => updateFounder({ instagram: event.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Facebook</label>
            <input
              type="url"
              value={content.founder.facebook}
              onChange={(event) => updateFounder({ facebook: event.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>YouTube</label>
            <input
              type="url"
              value={content.founder.youtube}
              onChange={(event) => updateFounder({ youtube: event.target.value })}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Biography</label>
          <textarea
            rows={3}
            value={content.founder.bio}
            onChange={(event) => updateFounder({ bio: event.target.value })}
            className={`${fieldClass} resize-none`}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Journey</label>
          <textarea
            rows={3}
            value={content.founder.journey}
            onChange={(event) => updateFounder({ journey: event.target.value })}
            className={`${fieldClass} resize-none`}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Mission</label>
          <textarea
            rows={2}
            value={content.founder.mission}
            onChange={(event) => updateFounder({ mission: event.target.value })}
            className={`${fieldClass} resize-none`}
          />
        </div>

        <StringListEditor
          label="Achievements (one per line)"
          items={content.founder.achievements}
          onChange={(items) => updateFounder({ achievements: items })}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 sm:gap-8">
          <div className="space-y-2">
            <label className={labelClass}>Book title</label>
            <input
              type="text"
              value={content.founder.bookTitle}
              onChange={(event) => updateFounder({ bookTitle: event.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Book description</label>
            <textarea
              rows={2}
              value={content.founder.bookDescription}
              onChange={(event) => updateFounder({ bookDescription: event.target.value })}
              className={`${fieldClass} resize-none`}
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className={`${panelClass} space-y-6`}>
        <h3 className="border-b border-hairline pb-4 font-display text-xl text-strong">Contact</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 sm:gap-8">
          <div className="space-y-2">
            <label className={labelClass}>Office label</label>
            <input
              type="text"
              value={content.contact.officeLabel}
              onChange={(event) => updateContact({ officeLabel: event.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Office address</label>
            <input
              type="text"
              value={content.contact.officeAddress}
              onChange={(event) => updateContact({ officeAddress: event.target.value })}
              className={fieldClass}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className={labelClass}>Map URL</label>
            <input
              type="url"
              value={content.contact.mapUrl}
              onChange={(event) => updateContact({ mapUrl: event.target.value })}
              className={fieldClass}
            />
          </div>
        </div>

        <ListEditor
          label="Business hours"
          addLabel="Add row"
          items={content.contact.businessHours as unknown as StringMap[]}
          fields={[
            { key: 'day', label: 'Day' },
            { key: 'hours', label: 'Hours' },
          ]}
          blank={{ day: '', hours: '' }}
          onChange={(items) =>
            updateContact({ businessHours: items as unknown as ContentSettings['contact']['businessHours'] })
          }
        />
      </section>

      {/* Streaming + Press + YouTube */}
      <section className={`${panelClass} space-y-6`}>
        <h3 className="border-b border-hairline pb-4 font-display text-xl text-strong">
          Streaming &amp; Press
        </h3>

        <ListEditor
          label="Streaming platforms"
          addLabel="Add platform"
          items={content.streamingPlatforms as unknown as StringMap[]}
          fields={[
            { key: 'label', label: 'Platform' },
            { key: 'href', label: 'Link' },
          ]}
          blank={{ label: '', href: '' }}
          onChange={(items) =>
            setContent((current) => ({
              ...current,
              streamingPlatforms: items as unknown as ContentSettings['streamingPlatforms'],
            }))
          }
        />

        <ListEditor
          label="Press resources"
          addLabel="Add resource"
          items={content.pressResources as unknown as StringMap[]}
          fields={[
            { key: 'title', label: 'Title' },
            { key: 'subject', label: 'Email subject' },
            { key: 'description', label: 'Description', textarea: true },
          ]}
          blank={{ title: '', subject: '', description: '' }}
          onChange={(items) =>
            setContent((current) => ({
              ...current,
              pressResources: items as unknown as ContentSettings['pressResources'],
            }))
          }
        />

        <div className="space-y-2">
          <label className={labelClass}>YouTube channel URL</label>
          <input
            type="url"
            value={content.youtube.channelUrl}
            onChange={(event) =>
              setContent((current) => ({
                ...current,
                youtube: { channelUrl: event.target.value },
              }))
            }
            className={fieldClass}
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button type="button" onClick={handleSave} disabled={!dirty} className={primaryButton}>
          <Save size={18} aria-hidden="true" /> Save Content
        </button>
      </div>
    </div>
  );
}
