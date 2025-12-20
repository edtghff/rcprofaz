import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

const newsData = [
  {
    slug: 'xeber-1',
    title: 'Yeni layihələrə başladıq',
    date: '15 Yanvar 2024',
    content: 'RC PROF yeni layihələrə başlamışdır. Müştərilərimizə daha yaxşı xidmət göstərmək üçün komandamızı genişləndirdik. Bu il ərzində bir çox uğurlu layihələr həyata keçirdik və gələcəkdə də davam etdirməyi planlaşdırırıq.',
    image: '/images/news/news-1.jpg',
  },
  {
    slug: 'xeber-2',
    title: 'Yeni xidmətlər təqdim edirik',
    date: '10 Yanvar 2024',
    content: 'Şüşə və cam balkon sistemləri üzrə yeni xidmətlərimizi təqdim edirik. Müasir texnologiyalar və keyfiyyətli materiallar istifadə edərək, müştərilərimizə ən yaxşı həlləri təqdim edirik.',
    image: '/images/news/news-2.jpg',
  },
]

export async function generateStaticParams() {
  return newsData.map((news) => ({
    slug: news.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const news = newsData.find((n) => n.slug === params.slug)
  
  if (!news) {
    return {
      title: 'Xəbər tapılmadı — RC PROF',
    }
  }

  return {
    title: `${news.title} — RC PROF`,
    description: news.content.substring(0, 160),
  }
}

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const news = newsData.find((n) => n.slug === params.slug)

  if (!news) {
    notFound()
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm mb-6 text-gray-500 font-light">
            <Link href="/" className="hover:text-gray-900">Ana səhifə</Link>
            <span className="mx-2">/</span>
            <Link href="/xeberler" className="hover:text-gray-900">Xəbərlər</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{news.title}</span>
          </nav>
          <span className="text-xs text-gray-500 mb-4 block font-light">{news.date}</span>
          <div className="mb-6">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium mb-4 text-gray-900 tracking-tight">{news.title}</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Image */}
          <div className="relative h-[400px] bg-gray-200 overflow-hidden mb-12 border border-gray-200">
            <Image
              src={news.image}
              alt={news.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="prose prose-base max-w-none">
            <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line font-light">
              {news.content}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

