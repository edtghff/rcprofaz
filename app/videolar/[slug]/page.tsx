import { notFound } from 'next/navigation'
import Image from 'next/image'
import { isPlayableVideoUrl, isLikelyImageUrl } from '@/data/videosData'
import Breadcrumbs from '@/components/Breadcrumbs'
import { loadVideos } from '@/lib/videosStore'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const videos = await loadVideos()
  return videos.map((video) => ({
    slug: video.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const videos = await loadVideos()
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
      images: video.thumbnail
        ? [
            /^https?:\/\//i.test(video.thumbnail)
              ? video.thumbnail
              : `${siteUrl.replace(/\/$/, '')}${video.thumbnail.startsWith('/') ? video.thumbnail : `/${video.thumbnail}`}`,
          ]
        : [],
    },
    alternates: {
      canonical: `/videolar/${video.slug}`,
    },
  }
}

export default async function VideoDetailPage({ params }: { params: { slug: string } }) {
  const videos = await loadVideos()
  const video = videos.find((v) => v.slug === params.slug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rcprof.az'

  if (!video) {
    notFound()
  }

  const mediaUrl = (video.videoUrl || '').trim()
  const playable = isPlayableVideoUrl(mediaUrl)
  const displayImage = video.thumbnail || (isLikelyImageUrl(mediaUrl) ? mediaUrl : '')

  const absThumb = video.thumbnail
    ? /^https?:\/\//i.test(video.thumbnail)
      ? video.thumbnail
      : `${siteUrl.replace(/\/$/, '')}${video.thumbnail.startsWith('/') ? video.thumbnail : `/${video.thumbnail}`}`
    : undefined

  const structuredData = playable
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.title,
        description: video.description,
        thumbnailUrl: absThumb,
        uploadDate: video.date,
        duration: video.duration,
        contentUrl: mediaUrl,
        embedUrl:
          mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')
            ? mediaUrl.replace(
                /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
                'https://www.youtube.com/embed/$1'
              )
            : mediaUrl.includes('vimeo.com')
              ? mediaUrl.replace(/vimeo.com\/(\d+)/, 'https://player.vimeo.com/video/$1')
              : mediaUrl,
        publisher: {
          '@type': 'Organization',
          name: 'RC PROF',
          url: siteUrl,
        },
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: video.title,
        description: video.description,
        image: displayImage || undefined,
      }

  const isYouTube = mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be')
  const isVimeo = mediaUrl.includes('vimeo.com')

  let embedUrl = mediaUrl
  if (isYouTube) {
    const youtubeId = mediaUrl.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    )?.[1]
    embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : mediaUrl
  } else if (isVimeo) {
    const vimeoId = mediaUrl.match(/vimeo.com\/(\d+)/)?.[1]
    embedUrl = vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : mediaUrl
  }

  const nativeVideoFile =
    playable && /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(mediaUrl.split('?')[0])

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
            {isYouTube || isVimeo ? (
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            ) : nativeVideoFile ? (
              <video
                src={mediaUrl}
                controls
                playsInline
                className="absolute inset-0 w-full h-full object-contain bg-black"
                title={video.title}
              />
            ) : displayImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={displayImage}
                  alt={`${video.title} — RC PROF`}
                  fill
                  className="object-cover"
                />
                {playable && mediaUrl && (
                  <a
                    href={mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
                  >
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </a>
                )}
              </div>
            ) : playable && mediaUrl ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <a
                  href={mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                >
                  <svg className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </a>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm font-light px-4 text-center">
                Bu qeydə yalnız mətn var; video və ya şəkil əlavə edilməyib.
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

