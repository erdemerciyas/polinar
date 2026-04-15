'use client'

import { useState, useCallback } from 'react'
import { getStaticLabels } from '@/data/static-labels'

interface VideoPlayerProps {
  videoUrl: string
  thumbnailUrl?: string | null
  title?: string | null
  locale: string
}

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0`
  }
  return url
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  )
  if (match) return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`
  return null
}

export function VideoPlayer({ videoUrl, thumbnailUrl, title, locale }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const labels = getStaticLabels(locale)

  const embedUrl = getYouTubeEmbedUrl(videoUrl)
  const poster = thumbnailUrl || getYouTubeThumbnail(videoUrl)

  const handlePlay = useCallback(() => setPlaying(true), [])

  if (playing && embedUrl) {
    return (
      <div className="relative aspect-video rounded-[3px] overflow-hidden shadow-2xl">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title || 'Video'}
        />
      </div>
    )
  }

  return (
    <button
      onClick={handlePlay}
      className="relative aspect-video w-full rounded-[3px] overflow-hidden shadow-2xl group cursor-pointer"
      aria-label={title ? `${labels.aria.playVideo} — ${title}` : labels.aria.playVideo}
    >
      {poster && (
        <img
          src={poster}
          alt={title || 'Video thumbnail'}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/30 transition-colors duration-300" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-polinar-mustard/90 group-hover:bg-polinar-mustard flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg">
          <svg className="w-8 h-8 lg:w-10 lg:h-10 text-navy ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Pulsing ring */}
      <div className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none">
        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-2 border-white/30 animate-ping" />
      </div>
    </button>
  )
}
