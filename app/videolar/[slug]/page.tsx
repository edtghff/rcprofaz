import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Video } from '@/data/videosData'
import Breadcrumbs from '@/components/Breadcrumbs'

async function getVideos(): Promise<Video[]> {
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const host = process.env.VERCEL_URL || 'localhost:3000'
    const baseUrl = `${protocol}://${host}`
    const res = await fetch(`${baseUrl}/api/videos`, { cache: 'no-store' })
    if (res.ok) {
      const data = await res.json()
      return data.videos || []
    }
  } catch (error) {
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

export async function generateStaticParams() {
  const videos = await getVideos()
  return videos.map((video) => ({
    slug: video.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const videos = await getVideos()
  const video = videos.find((v) => v.slug === params.slug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rcprof.az'
  
  if (!video) {
    return {
      title: 'Video tapılmadı — RC PROF',
    }
  }

  return {
    title: video.title,
    description: video.description,
    keywords: [
      video.title,
      video.category || '',
      'RC PROF',
      'video',
    ].filter(Boolean),
    openGraph: {
      title: `${video.title} — RC PROF`,
      description: video.description,
      type: 'video.other',
      url: `${siteUrl}/videolar/${video.slug}`,
      images: video.thumbnail ? [`${siteUrl}${video.thumbnail}`] : [],
    },
    alternates: {
      canonical: `/videolar/${video.slug}`,
    },
  }
}

export default async function VideoDetailPage({ params }: { params: { slug: string } }) {
  const videos = await getVideos()
  const video = videos.find((v) => v.slug === params.slug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rcprof.az'

  if (!video) {
    notFound()
  }

  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnail ? `${siteUrl}${video.thumbnail}` : undefined,
    uploadDate: video.date,
    duration: video.duration,
    contentUrl: video.videoUrl,
    embedUrl: video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be')
      ? video.videoUrl.replace(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/, 'https://www.youtube.com/embed/$1')
      : video.videoUrl.includes('vimeo.com')
      ? video.videoUrl.replace(/vimeo.com\/(\d+)/, 'https://player.vimeo.com/video/$1')
      : video.videoUrl,
    publisher: {
      '@type': 'Organization',
      name: 'RC PROF',
      url: siteUrl,
    },
  }

  // Определяем тип видео (YouTube, Vimeo или прямой URL)
  const isYouTube = video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be')
  const isVimeo = video.videoUrl.includes('vimeo.com')
  
  let embedUrl = video.videoUrl
  if (isYouTube) {
    const youtubeId = video.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
    embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : video.videoUrl
  } else if (isVimeo) {
    const vimeoId = video.videoUrl.match(/vimeo.com\/(\d+)/)?.[1]
    embedUrl = vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : video.videoUrl
  }

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Ana səhifə', href: '/' },
              { label: 'Videolar', href: '/videolar' },
              { label: video.title },
            ]}
          />
          {video.date && (
            <span className="text-xs text-gray-500 mb-4 block font-light">{video.date}</span>
          )}
          <div className="mb-6">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium mb-4 text-gray-900 tracking-tight">{video.title}</h1>
          {video.category && (
            <span className="inline-block text-sm text-gray-600 font-medium mb-4">{video.category}</span>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Video Player */}
          <div className="relative aspect-video bg-gray-200 overflow-hidden mb-8 border border-gray-200">
            {(isYouTube || isVimeo) ? (
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            ) : video.thumbnail ? (
              <div className="relative w-full h-full">
                <Image
                  src={video.thumbnail}
                  alt={`${video.title} - RC PROF video`}
                  fill
                  className="object-cover"
                />
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                >
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </a>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                >
                  <svg className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-base max-w-none">
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line font-light">
              {video.description}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

