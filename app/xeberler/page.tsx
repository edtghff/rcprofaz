import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Xəbərlər — RC PROF',
  description: 'RC PROF xəbərləri və yeniliklər.',
}

// Placeholder news data
const newsData = [
  {
    slug: 'xeber-1',
    title: 'Yeni layihələrə başladıq',
    date: '15 Yanvar 2024',
    excerpt: 'RC PROF yeni layihələrə başlamışdır. Müştərilərimizə daha yaxşı xidmət göstərmək üçün komandamızı genişləndirdik.',
    image: '/images/news/news-1.jpg',
  },
  {
    slug: 'xeber-2',
    title: 'Yeni xidmətlər təqdim edirik',
    date: '10 Yanvar 2024',
    excerpt: 'Şüşə və cam balkon sistemləri üzrə yeni xidmətlərimizi təqdim edirik.',
    image: '/images/news/news-2.jpg',
  },
]

export default function NewsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium mb-4 text-gray-900 tracking-tight">Xəbərlər</h1>
          <p className="text-lg text-gray-600 font-light">
            Son yeniliklər və xəbərlər
          </p>
        </div>
      </section>

      {/* News List */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {newsData.length > 0 ? (
            <div className="space-y-6">
              {newsData.map((news) => (
                <Link
                  key={news.slug}
                  href={`/xeberler/${news.slug}`}
                  className="group block bg-white overflow-hidden hover:shadow-md transition-all border border-gray-200 hover:border-gray-900"
                >
                  <div className="md:flex">
                    <div className="relative h-48 md:h-auto md:w-64 bg-gray-200">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <span className="text-xs text-gray-500 font-medium">{news.date}</span>
                      <h2 className="text-lg font-medium text-gray-900 mt-3 mb-3 group-hover:text-gray-800 transition-colors">
                        {news.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed font-light">{news.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-gray-200">
              <p className="text-gray-600 text-base font-light">Tezliklə xəbərlər əlavə olunacaq.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

