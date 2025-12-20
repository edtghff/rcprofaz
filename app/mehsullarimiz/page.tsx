import Link from 'next/link'
import Image from 'next/image'
import { productCategories, productsData } from '@/data/productsData'

export const metadata = {
  title: 'Məhsullarımız — RC PROF',
  description: 'RC PROF məhsulları: Liftlər, Eskalatorlar, İnşaat Avadanlıqları, Avtomatik Giriş Sistemləri.',
}

export default function ProductsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-medium mb-5 text-gray-900 tracking-tight">Məhsullarımız</h1>
          <p className="text-xl text-gray-600 font-light">
            Keyfiyyətli məhsullar və həllər
          </p>
        </div>
      </section>

      {/* Products Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-px bg-gray-900"></div>
            </div>
            <h2 className="text-4xl font-medium text-gray-900 text-center mb-4 tracking-tight">Məhsul kateqoriyaları</h2>
            <p className="text-base text-gray-600 text-center font-light">Bizim təqdim etdiyimiz bütün məhsullar</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productCategories.map((category) => {
              const product = productsData.find(p => p.slug === category.slug)
              return (
                <Link
                  key={category.slug}
                  href={`/mehsullarimiz/${category.slug}`}
                  className="group bg-white overflow-hidden hover:shadow-md transition-all border border-gray-200 hover:border-gray-900"
                >
                  <div className="relative h-64 bg-gray-200">
                    <Image
                      src={product?.image || '/images/products/placeholder.jpg'}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-light mb-4">{category.description}</p>
                    <span className="text-gray-900 font-medium text-sm inline-flex items-center group-hover:underline">
                      Ətraflı məlumat
                      <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
            <h2 className="text-4xl font-medium text-gray-900 mb-4 tracking-tight">Seçilmiş məhsullar</h2>
          </div>
          
          <div className="space-y-16">
            {productsData.slice(0, 2).map((product) => (
              <div key={product.slug} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative h-[500px] bg-gray-200 overflow-hidden border border-gray-200">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-4xl font-medium text-gray-900 mb-6 tracking-tight">{product.title}</h3>
                  <p className="text-lg text-gray-700 mb-8 font-light leading-relaxed">{product.description}</p>
                  
                  <div className="mb-8">
                    <h4 className="text-xl font-medium text-gray-900 mb-4">Xüsusiyyətlər</h4>
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
                      <h4 className="text-xl font-medium text-gray-900 mb-4">Texniki xüsusiyyətlər</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {product.specifications.capacity && (
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-900 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Yükləmə qabiliyyəti</div>
                              <div className="text-sm text-gray-900 font-medium">{product.specifications.capacity}</div>
                            </div>
                          </div>
                        )}
                        {product.specifications.speed && (
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-900 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Sürət</div>
                              <div className="text-sm text-gray-900 font-medium">{product.specifications.speed}</div>
                            </div>
                          </div>
                        )}
                        {product.specifications.height && (
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-900 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Hündürlük</div>
                              <div className="text-sm text-gray-900 font-medium">{product.specifications.height}</div>
                            </div>
                          </div>
                        )}
                        {product.specifications.doorType && (
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-900 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Qapı növü</div>
                              <div className="text-sm text-gray-900 font-medium">{product.specifications.doorType}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Link href={`/mehsullarimiz/${product.slug}`} className="btn-primary inline-block">
                    Ətraflı məlumat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
