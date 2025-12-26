import Link from 'next/link'
import Image from 'next/image'
import { Video } from '@/data/videosData'

export const metadata = {
  title: 'Videolar',
  description: 'RC PROF layihələri və xidmətləri haqqında videolar. Tikinti, təmir, dizayn, lift, qapı və şüşə sistemləri üzrə işlərimizi izləyin.',
  keywords: [
    'RC PROF videolar',
    'tikinti videolar',
    'layihə videolar',
    'lift quraşdırılması',
    'tikinti prosesi',
  ],
  openGraph: {
    title: 'Videolar — RC PROF',
    description: 'RC PROF layihələri və xidmətləri haqqında videolar',
    type: 'website',
  },
  alternates: {
    canonical: '/videolar',
  },
}

async function getVideos(): Promise<Video[]> {
  try {
    // Use absolute URL for server-side fetch
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = process.env.VERCEL_URL || 'localhost:3000'
    const baseUrl = `${protocol}://${host}`
    const res = await fetch(`${baseUrl}/api/videos`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      return data.videos || []
    }
  } catch (error) {
    // Fallback: try localhost if VERCEL_URL is not available
    try {
      const res = await fetch('http://localhost:3000/api/videos', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        return data.videos || []
      }
    } catch {
      // If both fail, return empty array
    }
  }
  return []
}

export default async function VideolarPage() {
  const videosData = await getVideos()
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium mb-4 text-gray-900 tracking-tight">Videolar</h1>
          <p className="text-lg text-gray-600 font-light">
            RC PROF layihələri və xidmətləri haqqında videolar
          </p>
        </div>
      </section>

      {/* Videos List */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {videosData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosData.map((video) => (
                <Link
                  key={video.slug}
                  href={`/videolar/${video.slug}`}
                  className="group block bg-white overflow-hidden hover:shadow-md transition-all border border-gray-200 hover:border-gray-900"
                >
                  <div className="relative aspect-video bg-gray-200 overflow-hidden">
                    {video.thumbnail ? (
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                        <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    )}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                        {video.duration}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    {video.category && (
                      <span className="text-xs text-gray-500 font-medium mb-2 block">{video.category}</span>
                    )}
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                      {video.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed font-light line-clamp-2 mb-3">
                      {video.description}
                    </p>
                    {video.date && (
                      <span className="text-xs text-gray-500 font-light">{video.date}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-gray-200">
              <p className="text-gray-600 mb-8 text-base font-light">Tezliklə burada videolar görünəcək.</p>
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

