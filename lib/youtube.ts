/** YouTube link → video ID, embed, thumbnail (watch, youtu.be, shorts, embed). */
export function extractYouTubeVideoId(url: string): string | null {
  const u = (url || '').trim()
  if (!u) return null

  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const re of patterns) {
    const m = u.match(re)
    if (m?.[1]) return m[1]
  }
  return null
}

export function isYouTubeUrl(url: string | undefined | null): boolean {
  return extractYouTubeVideoId(url || '') !== null
}

export function normalizeYouTubeWatchUrl(url: string): string | null {
  const id = extractYouTubeVideoId(url)
  return id ? `https://www.youtube.com/watch?v=${id}` : null
}

export function youtubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeVideoId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

export function youtubeThumbnailUrl(url: string): string | null {
  const id = extractYouTubeVideoId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}
