import Link from 'next/link'
import Image from 'next/image'
import { servicesData } from '@/data/servicesData'
import { productsData } from '@/data/productsData'

export const metadata = {
  title: 'RC PROF — Tikinti, Təmir, Dizayn, Lift, Qapı və Şüşə Sistemləri',
  description: 'RC PROF Bakıda tikinti, təmir, dizayn, lift satışı və servisi, qapı və şüşə sistemləri üzrə korporativ xidmətlər təqdim edir.',
}

export default function Home() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[70vh] min-h-[500px] bg-white">
        <div className="absolute inset-0 bg-gray-50">
          <Image
            src="/images/hero-banner.jpg"
            alt="RC PROF Hero"
            fill
            className="object-cover opacity-20"
            priority
            quality={90}
          />
        </div>
        {/* Decorative lines */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl">
            <div className="mb-6">
              <div className="w-16 h-px bg-gray-900 mb-4"></div>
            </div>
            <h1 className="text-6xl md:text-7xl font-medium mb-8 tracking-tight leading-tight text-gray-900">
              RC PROF
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-600 font-light leading-relaxed">
              Tikinti • Təmir • Dizayn • Lift • Qapı • Şüşə Sistemləri
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/elaqe" className="btn-primary inline-flex items-center justify-center">
                Əlaqə
              </Link>
              <Link href="/haqqimizda" className="btn-secondary inline-flex items-center justify-center">
                Haqqımızda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="mb-6">
                <div className="w-12 h-px bg-gray-900 mb-4"></div>
                <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-5 tracking-tight">
                  Haqqımızda
                </h2>
                <p className="text-lg text-gray-600 mb-10 font-light">
                  Güvənlə yüksələk, inamla addımlayaq!
                </p>
              </div>
              <div className="space-y-5 text-gray-700 text-lg leading-relaxed mb-10 font-light">
                <p>
                  RC PROF — tikinti və texniki həllər sahəsində fəaliyyət göstərən çoxprofilli şirkətdir. 
                  Biz yaşayış və kommersiya obyektləri üçün tikinti, təmir, dizayn, lift, qapı və şüşə 
                  sistemləri üzrə tam paket xidmətlər təqdim edirik.
                </p>
                <p>
                  Məqsədimiz hər layihədə keyfiyyət, dəqiqlik və uzunömürlü nəticə əldə etməkdir. 
                  RC PROF müştərilərinə yalnız iş deyil, etibar təqdim edir.
                </p>
              </div>
              <Link href="/haqqimizda" className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors group">
                Daha çox oxu
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="relative h-[450px] bg-gray-100 overflow-hidden border border-gray-200">
              <Image
                src="/images/about-preview.jpg"
                alt="RC PROF Haqqımızda"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-4 tracking-tight">
                  Xidmətlərimiz
                </h2>
                <p className="text-lg text-gray-600 font-light">
                  Geniş spektrli peşəkar xidmətlər
                </p>
              </div>
              <Link href="/xidmetler" className="mt-6 md:mt-0 inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors group">
                Bütün xidmətlərə bax
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesData.slice(0, 4).map((service) => (
              <Link
                key={service.slug}
                href={`/xidmetler/${service.slug}`}
                className="card card-hover group overflow-hidden"
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <Image
                    src={`/images/services/${service.slug}.jpg`}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-5 line-clamp-2 text-base font-light">{service.description}</p>
                  <span className="text-gray-800 font-medium text-base inline-flex items-center group-hover:translate-x-1 transition-transform">
                    Ətraflı
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why RC PROF */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-px bg-gray-900"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-4 tracking-tight">
              Niyə RC PROF?
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Bizim üstünlüklərimiz
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              'Bir ünvandan tam xidmət',
              'Peşəkar və təcrübəli komanda',
              'Keyfiyyətli materiallar',
              'Vaxtında və dəqiq icra',
              'Müştəri məmnuniyyəti',
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-white hover:bg-gray-50 transition-colors border border-gray-200">
                <div className="w-12 h-12 bg-gray-900 flex items-center justify-center mx-auto mb-4">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Projects */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-4 tracking-tight">
                  Layihələrimiz
                </h2>
                <p className="text-lg text-gray-600 font-light">
                  Uğurla tamamlanmış layihələrimiz
                </p>
              </div>
              <Link href="/layiheler" className="mt-6 md:mt-0 inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors group">
                Bütün layihələrə bax
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsData.slice(0, 4).map((product) => (
              <Link
                key={product.slug}
                href={`/mehsullarimiz/${product.slug}`}
                className="card card-hover group overflow-hidden"
              >
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-base line-clamp-2 font-light">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

