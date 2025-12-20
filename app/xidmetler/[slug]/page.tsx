import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { servicesData } from '@/data/servicesData'

export async function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = servicesData.find((s) => s.slug === params.slug)
  
  if (!service) {
    return {
      title: 'Xidmət tapılmadı — RC PROF',
    }
  }

  return {
    title: `${service.title} — RC PROF`,
    description: service.description,
  }
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = servicesData.find((s) => s.slug === params.slug)

  if (!service) {
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
            <Link href="/xidmetler" className="hover:text-gray-900">Xidmətlər</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{service.title}</span>
          </nav>
          <div className="mb-6">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium mb-4 text-gray-900 tracking-tight">{service.title}</h1>
          <p className="text-lg text-gray-600 font-light">{service.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Image */}
          <div className="relative h-[400px] bg-gray-200 overflow-hidden mb-12 border border-gray-200">
            <Image
              src={`/images/services/${service.slug}.jpg`}
              alt={service.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Service Items */}
          <div className="mb-12">
            <div className="mb-6">
              <div className="w-12 h-px bg-gray-900 mb-4"></div>
              <h2 className="text-3xl font-medium text-gray-900 mb-8 tracking-tight">Xidmət təklifləri</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.items.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 bg-gray-50 p-5 border border-gray-200">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-gray-800 text-sm font-medium pt-1">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Process Section */}
          {service.process && service.process.length > 0 && (
            <div className="mb-12">
              <div className="mb-6">
                <div className="w-12 h-px bg-gray-900 mb-4"></div>
                <h2 className="text-3xl font-medium text-gray-900 mb-8 tracking-tight">İş prosesi</h2>
              </div>
              <div className="space-y-4">
                {service.process.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 bg-gray-50 p-6 border border-gray-200">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center font-medium text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <p className="text-gray-800 text-base font-light pt-2">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advantages Section */}
          {service.advantages && service.advantages.length > 0 && (
            <div className="mb-12">
              <div className="mb-6">
                <div className="w-12 h-px bg-gray-900 mb-4"></div>
                <h2 className="text-3xl font-medium text-gray-900 mb-8 tracking-tight">Üstünlüklər</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.advantages.map((advantage, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-gray-50 p-5 border border-gray-200">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-gray-900"
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
                    <span className="text-gray-800 text-sm font-medium pt-1">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applications Section */}
          {service.applications && service.applications.length > 0 && (
            <div className="mb-12">
              <div className="mb-6">
                <div className="w-12 h-px bg-gray-900 mb-4"></div>
                <h2 className="text-3xl font-medium text-gray-900 mb-8 tracking-tight">Tətbiq sahələri</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {service.applications.map((application, index) => (
                  <div key={index} className="bg-gray-50 p-5 border border-gray-200 text-center">
                    <span className="text-gray-800 text-sm font-medium">{application}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          {service.additionalInfo && (
            <div className="mb-12 bg-gray-50 p-8 border border-gray-200">
              <p className="text-gray-700 text-base font-light leading-relaxed">{service.additionalInfo}</p>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gray-900 p-10 text-center text-white border border-gray-900">
            <h3 className="text-2xl font-medium mb-4">
              Bu xidmət haqqında ətraflı məlumat almaq istəyirsiniz?
            </h3>
            <p className="text-base text-gray-300 mb-6 font-light">
              Bizimlə əlaqə saxlayın və peşəkar məsləhət alın.
            </p>
            <Link href="/elaqe" className="btn-primary bg-white text-gray-900 hover:bg-gray-100 inline-block">
              Əlaqə saxla
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

