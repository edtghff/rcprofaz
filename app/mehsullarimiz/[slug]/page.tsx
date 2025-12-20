import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { productsData } from '@/data/productsData'

export async function generateStaticParams() {
  return productsData.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = productsData.find((p) => p.slug === params.slug)
  
  if (!product) {
    return {
      title: 'Məhsul tapılmadı — RC PROF',
    }
  }

  return {
    title: `${product.title} — RC PROF`,
    description: product.description,
  }
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = productsData.find((p) => p.slug === params.slug)

  if (!product) {
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
            <Link href="/mehsullarimiz" className="hover:text-gray-900">Məhsullarımız</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </nav>
          <div className="mb-6">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-medium mb-5 text-gray-900 tracking-tight">{product.title}</h1>
          <p className="text-xl text-gray-600 font-light">{product.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            <div className="relative h-[600px] bg-gray-200 overflow-hidden border border-gray-200">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div>
              <h2 className="text-3xl font-medium text-gray-900 mb-6 tracking-tight">Məhsul haqqında</h2>
              <p className="text-lg text-gray-700 mb-8 font-light leading-relaxed">
                {product.description}
              </p>

              <div className="mb-8">
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Xüsusiyyətlər</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                      </div>
                      <span className="text-gray-700 text-base font-light">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {product.specifications && (
                <div className="mb-8">
                  <h3 className="text-2xl font-medium text-gray-900 mb-4">Texniki xüsusiyyətlər</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => {
                      if (!value) return null;
                      const labels: { [key: string]: string } = {
                        capacity: 'Yükləmə qabiliyyəti',
                        speed: 'Sürət',
                        height: 'Hündürlük',
                        doorType: 'Qapı növü',
                        motor: 'Mühərrik',
                        standards: 'Standartlar',
                        angle: 'Bucaq',
                        width: 'En',
                        types: 'Növlər',
                        cabinSize: 'Kabinə ölçüsü',
                        floorCount: 'Mərtəbə sayı',
                        power: 'Güc',
                        sensors: 'Sensorlar',
                      };
                      return (
                        <div key={key} className="flex items-start space-x-4 p-4 bg-gray-50 border border-gray-200">
                          <div className="w-12 h-12 bg-gray-900 flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 font-medium">{labels[key] || key}</div>
                            <div className="text-base text-gray-900 font-medium">{value}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Applications Section */}
              {product.applications && product.applications.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-medium text-gray-900 mb-4">Tətbiq sahələri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.applications.map((application, index) => (
                      <div key={index} className="flex items-center space-x-3 bg-gray-50 p-4 border border-gray-200">
                        <svg className="w-5 h-5 text-gray-900 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-gray-800 text-sm font-medium">{application}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advantages Section */}
              {product.advantages && product.advantages.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-medium text-gray-900 mb-4">Üstünlüklər</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.advantages.map((advantage, index) => (
                      <div key={index} className="flex items-start space-x-3 bg-gray-50 p-4 border border-gray-200">
                        <svg className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-800 text-sm font-medium">{advantage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants Section */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-medium text-gray-900 mb-4">Mövcud variantlar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.variants.map((variant, index) => (
                      <div key={index} className="bg-gray-50 p-4 border border-gray-200">
                        <span className="text-gray-800 text-sm font-medium">{variant}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              {product.additionalInfo && (
                <div className="mb-8 bg-gray-50 p-6 border border-gray-200">
                  <p className="text-gray-700 text-base font-light leading-relaxed">{product.additionalInfo}</p>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gray-900 p-10 text-center text-white border border-gray-900">
            <h3 className="text-2xl font-medium mb-4">
              Bu məhsul haqqında ətraflı məlumat almaq istəyirsiniz?
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

