import type { Video } from '@/data/videosData'
import { isYouTubeUrl, normalizeYouTubeWatchUrl, youtubeThumbnailUrl } from '@/lib/youtube'

/** YouTube link + thumbnail; canonical watch URL for embed. */
export function enrichVideoRecord(video: Video): Video {
  const videoUrl = (video.videoUrl || '').trim()
  const thumbnail = (video.thumbnail || '').trim()

  if (!isYouTubeUrl(videoUrl)) {
    return { ...video, videoUrl, thumbnail }
  }

  const normalized = normalizeYouTubeWatchUrl(videoUrl) || videoUrl
  const autoThumb = youtubeThumbnailUrl(videoUrl)

  return {
    ...video,
    videoUrl: normalized,
    thumbnail: thumbnail || autoThumb || '',
  }
}

export function videoListThumbnail(video: Video): string {
  const thumb = (video.thumbnail || '').trim()
  if (thumb) return thumb
  return youtubeThumbnailUrl(video.videoUrl || '') || ''
}
