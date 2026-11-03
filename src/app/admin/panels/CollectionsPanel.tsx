'use client';

import React from 'react';
import CollectionPanel, { type FieldDef } from './CollectionPanel';
import {
  createId,
  readAnnouncements,
  readArtists,
  readPortfolioSpaces,
  readReleases,
  readStudioEvents,
  readVideos,
  saveAnnouncements,
  saveArtists,
  savePortfolioSpaces,
  saveReleases,
  saveStudioEvents,
  saveVideos,
} from '@/lib/store';
import { slugify } from '@/lib/site';
import type {
  Announcement,
  Artist,
  PortfolioSpace,
  Release,
  StudioEvent,
  YouTubeVideo,
} from '@/data/initialData';

const RELEASE_TYPES = ['Single', 'EP', 'Album', 'Mixtape', 'Live'] as const;
const EVENT_STATUS = ['upcoming', 'ended'] as const;

const artistFields: FieldDef[] = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'genre', label: 'Genre', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'photo', label: 'Artist photo', type: 'image' },
  { key: 'bio', label: 'Biography', type: 'textarea', full: true },
  { key: 'highlights', label: 'Highlights (one per line)', type: 'list', full: true },
  { key: 'legacy', label: 'Legacy / alumnus', type: 'checkbox' },
];

const releaseFields: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'slug', label: 'Slug', type: 'text', placeholder: 'auto from title if left blank' },
  { key: 'artist', label: 'Artist', type: 'text' },
  { key: 'type', label: 'Type', type: 'select', options: RELEASE_TYPES },
  { key: 'releaseDate', label: 'Release date', type: 'date' },
  { key: 'coverArt', label: 'Cover art', type: 'image' },
  { key: 'listenUrl', label: 'Listen URL', type: 'url' },
  { key: 'link', label: 'Share link', type: 'url' },
  { key: 'audioUrl', label: 'Audio file URL (optional)', type: 'url' },
  { key: 'featured', label: 'Featured release', type: 'checkbox' },
  { key: 'description', label: 'Description', type: 'textarea', full: true },
];

const eventFields: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'date', label: 'Date & time', type: 'datetime' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: EVENT_STATUS },
  { key: 'ticketPrice', label: 'Ticket price', type: 'text' },
  { key: 'registerUrl', label: 'Registration URL', type: 'url' },
  { key: 'description', label: 'Description', type: 'textarea', full: true },
  { key: 'gallery', label: 'Gallery images', type: 'imageList', full: true },
];

const announcementFields: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'slug', label: 'Slug', type: 'text', placeholder: 'auto from title if left blank' },
  { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. news, release' },
  { key: 'date', label: 'Date & time', type: 'datetime' },
  { key: 'body', label: 'Body', type: 'textarea', full: true },
];

const spaceFields: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'image', label: 'Space image', type: 'image' },
  { key: 'description', label: 'Description', type: 'textarea', full: true },
];

const videoFields: FieldDef[] = [
  { key: 'title', label: 'Video title', type: 'text' },
  { key: 'url', label: 'YouTube URL', type: 'url' },
];

export function ArtistsPanel() {
  return (
    <CollectionPanel<Artist>
      title="Artist Roster"
      emptyLabel="No artistes yet. Add your first roster entry."
      addLabel="Add artiste"
      fields={artistFields}
      initial={readArtists}
      createBlank={() => ({
        id: createId('ar'),
        name: 'New artiste',
        genre: '',
        bio: '',
        location: '',
        photo: '',
        highlights: [],
        legacy: false,
      })}
      onSave={saveArtists}
      recordTitle={(artist) => artist.name}
    />
  );
}

export function ReleasesPanel() {
  return (
    <CollectionPanel<Release>
      title="Release Catalogue"
      emptyLabel="No releases yet. Add your first record."
      addLabel="Add release"
      fields={releaseFields}
      initial={readReleases}
      createBlank={() => ({
        id: createId('r'),
        slug: '',
        title: 'New release',
        artist: 'Samrock',
        type: 'Single',
        releaseDate: '',
        description: '',
        listenUrl: '',
        link: '',
        audioUrl: '',
        coverArt: '',
        featured: false,
      })}
      onSave={saveReleases}
      recordTitle={(release) => release.title}
      beforeSave={(records) =>
        records.map((release) => ({
          ...release,
          slug: release.slug.trim() ? slugify(release.slug) : slugify(release.title),
        }))
      }
    />
  );
}

export function EventsPanel() {
  return (
    <CollectionPanel<StudioEvent>
      title="Studio Events"
      emptyLabel="No events yet. Add a session, class or open studio day."
      addLabel="Add event"
      fields={eventFields}
      initial={readStudioEvents}
      createBlank={() => ({
        id: createId('ev'),
        title: 'New event',
        description: '',
        date: '',
        location: '',
        status: 'upcoming',
        ticketPrice: '',
        gallery: [],
        registerUrl: '',
      })}
      onSave={saveStudioEvents}
      recordTitle={(event) => event.title}
    />
  );
}

export function AnnouncementsPanel() {
  return (
    <CollectionPanel<Announcement>
      title="Announcements"
      emptyLabel="No announcements yet. Add your first news item."
      addLabel="Add announcement"
      fields={announcementFields}
      initial={readAnnouncements}
      createBlank={() => ({
        id: createId('an'),
        slug: '',
        title: 'New announcement',
        category: 'news',
        date: '',
        body: '',
      })}
      onSave={saveAnnouncements}
      recordTitle={(announcement) => announcement.title}
      beforeSave={(records) =>
        records.map((announcement) => ({
          ...announcement,
          slug: announcement.slug.trim() ? slugify(announcement.slug) : slugify(announcement.title),
        }))
      }
    />
  );
}

export function SpacesPanel() {
  return (
    <CollectionPanel<PortfolioSpace>
      title="Creative Spaces"
      emptyLabel="No creative spaces yet. Add the rooms and services shown on the portfolio."
      addLabel="Add space"
      fields={spaceFields}
      initial={readPortfolioSpaces}
      createBlank={() => ({
        id: createId('ps'),
        title: 'New space',
        description: '',
        image: '',
      })}
      onSave={savePortfolioSpaces}
      recordTitle={(space) => space.title}
    />
  );
}

export function VideosPanel() {
  return (
    <CollectionPanel<YouTubeVideo>
      title="Video Visuals"
      emptyLabel="No videos yet. Paste a YouTube link to feature it on the site."
      addLabel="Add video"
      fields={videoFields}
      initial={readVideos}
      createBlank={() => ({ id: createId('vid'), title: 'New video', url: '' })}
      onSave={saveVideos}
      recordTitle={(video) => video.title}
    />
  );
}
