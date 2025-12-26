import Link from 'next/link'
import { servicesData } from '@/data/servicesData'

export const metadata = {
  title: 'Xidmətlər',
  description: 'RC PROF xidmətləri: Tikinti və təmir, dizayn, lift satışı və servisi, qapı və şüşə sistemləri. Bakıda peşəkar tikinti və texniki həllər.',
  keywords: [
    'RC PROF xidmətləri',
    'tikinti xidmətləri Bakı',
    'təmir xidmətləri',
    'dizayn xidmətləri',
    'lift satışı',
    'lift servisi',
    'qapı sistemləri',
    'şüşə sistemləri',
  ],
  openGraph: {
    title: 'Xidmətlər — RC PROF',
    description: 'RC PROF xidmətləri: Tikinti və təmir, dizayn, lift satışı və servisi, qapı və şüşə sistemləri.',
    type: 'website',
  },
  alternates: {
    canonical: '/xidmetler',
  },
}

export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-medium mb-5 text-gray-900 tracking-tight">Xidmətlərimiz</h1>
          <p className="text-xl text-gray-600 font-light">
            Geniş spektrli peşəkar xidmətlər
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-px bg-gray-900"></div>
            </div>
            <h2 className="text-4xl font-medium text-gray-900 text-center mb-4 tracking-tight">Xidmət kateqoriyaları</h2>
            <p className="text-lg text-gray-600 text-center font-light">Bizim təqdim etdiyimiz bütün xidmətlər</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map((service) => (
              <Link
                key={service.slug}
                href={`/xidmetler/${service.slug}`}
                className="group bg-white p-8 hover:shadow-md transition-all border border-gray-200 hover:border-gray-900"
              >
                <div className="mb-6">
                  <div className="w-12 h-12 bg-gray-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h2 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                  {service.title}
                </h2>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed font-light">{service.description}</p>
                {service.items && service.items.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2 font-medium">{service.items.length} xidmət növü</p>
                    <ul className="space-y-1">
                      {service.items.slice(0, 3).map((item, index) => (
                        <li key={index} className="text-xs text-gray-600 font-light flex items-start">
                          <span className="text-gray-900 mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                      {service.items.length > 3 && (
                        <li className="text-xs text-gray-500 font-light">+ {service.items.length - 3} daha</li>
                      )}
                    </ul>
                  </div>
                )}
                <span className="text-gray-900 font-medium text-sm group-hover:underline inline-flex items-center">
                  Ətraflı məlumat
                  <svg
                    className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

