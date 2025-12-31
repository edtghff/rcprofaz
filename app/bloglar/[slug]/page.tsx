import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Blog } from '@/data/blogsData'
import Breadcrumbs from '@/components/Breadcrumbs'

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

export async function generateStaticParams() {
  const blogs = await getBlogs()
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blogs = await getBlogs()
  const blog = blogs.find((b) => b.slug === params.slug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rcprof.az'
  
  if (!blog) {
    return {
      title: 'Blog tapılmadı — RC PROF',
    }
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    keywords: [
      blog.title,
      blog.category || '',
      ...(blog.tags || []),
      'RC PROF',
      'blog',
    ].filter(Boolean),
    authors: blog.author ? [{ name: blog.author }] : undefined,
    openGraph: {
      title: `${blog.title} — RC PROF`,
      description: blog.excerpt,
      type: 'article',
      url: `${siteUrl}/bloglar/${blog.slug}`,
      images: [`${siteUrl}${blog.image}`],
      publishedTime: blog.date,
      authors: blog.author ? [blog.author] : undefined,
      tags: blog.tags,
    },
    alternates: {
      canonical: `/bloglar/${blog.slug}`,
    },
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blogs = await getBlogs()
  const blog = blogs.find((b) => b.slug === params.slug)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rcprof.az'

  if (!blog) {
    notFound()
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: `${siteUrl}${blog.image}`,
    datePublished: blog.date,
    author: {
      '@type': 'Organization',
      name: blog.author || 'RC PROF',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RC PROF',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/rcprof-logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/bloglar/${blog.slug}`,
    },
    ...(blog.tags && {
      keywords: blog.tags.join(', '),
    }),
  }

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Ana səhifə', href: '/' },
              { label: 'Bloglar', href: '/bloglar' },
              { label: blog.title },
            ]}
          />
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs text-gray-500 font-light">{blog.date}</span>
            {blog.category && (
              <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                {blog.category}
              </span>
            )}
            {blog.author && (
              <span className="text-xs text-gray-500 font-light">Müəllif: {blog.author}</span>
            )}
          </div>
          <div className="mb-6">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium mb-4 text-gray-900 tracking-tight">{blog.title}</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Image */}
          <div className="relative h-[400px] bg-gray-200 overflow-hidden mb-12 border border-gray-200">
            <Image
              src={blog.image}
              alt={`${blog.title} - RC PROF blog yazısı`}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-light"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-base max-w-none">
            {blog.content ? (
              <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line font-light">
                {blog.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-700 text-base leading-relaxed font-light">
                {blog.excerpt}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

