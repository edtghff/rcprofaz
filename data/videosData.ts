export interface Video {
  slug: string
  title: string
  description: string
  videoUrl: string // YouTube, Vimeo или прямой URL к видео
  thumbnail?: string // Превью изображение
  category?: string
  date: string
  duration?: string
}

// This will be populated from API at runtime
export const videosData: Video[] = []

