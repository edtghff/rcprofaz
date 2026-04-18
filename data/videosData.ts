export interface Video {
  slug: string
  title: string
  description: string
  /** YouTube/Vimeo, прямой URL видео, или пусто — только фото (thumbnail) */
  videoUrl?: string
  thumbnail?: string // Превью изображение
  category?: string
  date: string
  duration?: string
}

/** Реальное видео (показываем play / плеер), не фото */
export function isPlayableVideoUrl(url: string | undefined | null): boolean {
  const u = (url || '').trim()
  if (!u) return false
  if (/youtube\.com|youtu\.be|vimeo\.com/i.test(u)) return true
  if (/\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(u.split('?')[0])) return true
  if (/\/videos\//i.test(u)) return true
  return false
}

export function isLikelyImageUrl(url: string | undefined | null): boolean {
  const u = (url || '').trim()
  if (!u) return false
  const path = u.split('?')[0].toLowerCase()
  if (/\.(png|jpe?g|gif|webp|avif|bmp|svg)$/.test(path)) return true
  if (/\/images\//i.test(u)) return true
  return false
}

// This will be populated from API at runtime
export const videosData: Video[] = []

