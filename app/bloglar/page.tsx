import Link from 'next/link'
import Image from 'next/image'
import { Blog } from '@/data/blogsData'

export const metadata = {
  title: 'Bloglar',
  description: 'RC PROF blog yazıları və xəbərlər. Tikinti, təmir, dizayn və texniki həllər haqqında faydalı məlumatlar və məqalələr.',
  keywords: [
    'RC PROF blog',
    'tikinti məqalələri',
    'tikinti tips',
    'təmir məsləhətləri',
    'dizayn ideyaları',
  ],
  openGraph: {
    title: 'Bloglar — RC PROF',
    description: 'RC PROF blog yazıları və xəbərlər',
    type: 'website',
  },
  alternates: {
    canonical: '/bloglar',
  },
}

async function getBlogs(): Promise<Blog[]> {
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = process.env.VERCEL_URL || 'localhost:3000'
    const baseUrl = `${protocol}://${host}`
    const res = await fetch(`${baseUrl}/api/blogs`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      return data.blogs || []
    }
  } catch (error) {
    try {
      const res = await fetch('http://localhost:3000/api/blogs', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        return data.blogs || []
      }
    } catch {
      // If both fail, return empty array
    }
  }
  return []
}

export default async function BloglarPage() {
  const blogsData = await getBlogs()
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium mb-4 text-gray-900 tracking-tight">Bloglar</h1>
          <p className="text-lg text-gray-600 font-light">
            RC PROF blog yazıları və xəbərlər
          </p>
        </div>
      </section>

      {/* Blogs List */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogsData.length > 0 ? (
            <div className="space-y-6">
              {blogsData.map((blog) => (
                <Link
                  key={blog.slug}
                  href={`/bloglar/${blog.slug}`}
                  className="group block bg-white overflow-hidden hover:shadow-md transition-all border border-gray-200 hover:border-gray-900"
                >
                  <div className="md:flex">
                    <div className="relative h-48 md:h-auto md:w-64 bg-gray-200">
                      <Image
                        src={blog.image}
                        alt={`${blog.title} - RC PROF blog yazısı`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {blog.category && (
                          <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                            {blog.category}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 font-light">{blog.date}</span>
                      </div>
                      <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 text-base leading-relaxed font-light line-clamp-3 mb-4">
                        {blog.excerpt}
                      </p>
                      {blog.author && (
                        <span className="text-sm text-gray-500 font-light">Müəllif: {blog.author}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-gray-200">
              <p className="text-gray-600 mb-8 text-base font-light">Tezliklə burada blog yazıları görünəcək.</p>
              <Link href="/" className="btn-primary inline-flex items-center">
                Ana səhifəyə qayıt
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

