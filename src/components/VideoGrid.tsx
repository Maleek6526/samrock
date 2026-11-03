'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { getVideoFileUrl, getYouTubeEmbedUrl } from '@/lib/embeds';
import { useContentSettings, useVideos } from '@/lib/store';

/**
 * "Visuals" grid. Each entry is either a YouTube embed, a direct video file
 * (including clips picked from the device), or an external link. Falls back to
 * an empty state until videos are added in the admin.
 */
export default function VideoGrid() {
  const videos = useVideos();
  const { youtube } = useContentSettings();

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6 border border-dashed border-hairline bg-surface-2 px-6 py-14 sm:px-10">
        <div>
          <h3 className="font-display text-title text-strong">Visuals coming soon</h3>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-silver">
            Music videos, live sessions and behind-the-scenes clips from the studio will appear here.
          </p>
        </div>
        {youtube.channelUrl ? (
          <a
            href={youtube.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Visit the channel <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {videos.map((video) => {
        const embed = getYouTubeEmbedUrl(video.url);
        const fileSource = getVideoFileUrl(video.url);

        return (
          <article key={video.id} className="border-t border-hairline pt-5">
            <div className="relative aspect-video overflow-hidden rounded-xs border border-hairline bg-surface-2">
              {embed ? (
                <iframe
                  src={embed}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
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
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center text-brand"
                >
                  <ArrowUpRight size={28} aria-hidden="true" />
                </a>
              )}
            </div>
            <h3 className="mt-5 font-display text-title text-strong">{video.title}</h3>
          </article>
        );
      })}
    </div>
  );
}
