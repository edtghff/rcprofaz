import Link from 'next/link'
import Image from 'next/image'
import { isPlayableVideoUrl } from '@/data/videosData'
import { loadVideos } from '@/lib/videosStore'

/** Siyahı Supabase-dən gəlir; statik keşdə boş qalmaması üçün */
export const dynamic = 'force-dynamic'

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

export default async function VideolarPage() {
  const videosData = await loadVideos()
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
              {videosData.map((video) => {
                const showPlay = isPlayableVideoUrl(video.videoUrl)
                return (
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
                        {showPlay ? (
                          <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        ) : (
                          <svg className="w-14 h-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                    )}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                        {video.duration}
                      </div>
                    )}
                    {showPlay && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    )}
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
                )
              })}
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

