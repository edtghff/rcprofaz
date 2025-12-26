export interface Blog {
  slug: string
  title: string
  excerpt: string
  content?: string // Полный текст статьи (для страницы блога)
  image: string
  date: string
  author?: string
  category?: string
  tags?: string[]
}

// This will be populated from API at runtime
export const blogsData: Blog[] = []

