import Link from 'next/link'
import Image from 'next/image'
import { servicesData } from '@/data/servicesData'
import { productsData } from '@/data/productsData'
import { projectsData } from '@/data/projectsData'
import { Video } from '@/data/videosData'
import ContactFormSection from '@/components/ContactFormSection'
import HeroSection from '@/components/HeroSection'
import FixedContactButtons from '@/components/FixedContactButtons'

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

export const metadata = {
  title: 'Ana Səhifə',
  description: 'RC PROF Bakıda tikinti, təmir, dizayn, lift satışı və servisi, qapı və şüşə sistemləri üzrə korporativ xidmətlər təqdim edir. Peşəkar komanda, keyfiyyətli materiallar və vaxtında icra ilə.',
  keywords: [
    'RC PROF',
    'tikinti Bakı',
    'təmir işləri Bakı',
    'dizayn xidmətləri',
    'lift satışı Bakı',
    'lift servisi',
    'qapı sistemləri',
    'şüşə sistemləri',
    'cam balkon',
    'tikinti şirkəti Bakı',
  ],
  openGraph: {
    title: 'RC PROF — Tikinti, Təmir, Dizayn, Lift, Qapı və Şüşə Sistemləri',
    description: 'RC PROF Bakıda tikinti, təmir, dizayn, lift satışı və servisi, qapı və şüşə sistemləri üzrə korporativ xidmətlər təqdim edir.',
    type: 'website',
    images: ['/images/about-preview.jpg'],
  },
  alternates: {
    canonical: '/',
  },
}

export default async function Home() {
  const videosData = await getVideos()
  
  return (
    <>
      {/* Hero Banner with Video Background */}
      <HeroSection />
      
      {/* Fixed Contact Buttons */}
      <FixedContactButtons />

      {/* About Preview */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <div className="mb-8">
                <div className="w-12 h-px bg-gray-900 mb-4"></div>
                <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6 tracking-tight">
                  Haqqımızda
                </h2>
                <p className="text-xl md:text-2xl text-gray-600 mb-10 font-light leading-relaxed">
                  <strong className="font-semibold text-gray-900">Güvənlə yüksələk, inamla addımlayaq!</strong>
                </p>
              </div>
              <div className="space-y-6 text-gray-700 text-xl md:text-lg leading-relaxed mb-10 font-light">
                <p className="leading-relaxed">
                  <strong className="font-semibold text-gray-900">RC PROF</strong> — tikinti və texniki həllər sahəsində fəaliyyət göstərən 
                  <strong className="font-semibold text-gray-900"> çoxprofilli şirkətdir</strong>. 
                  Biz yaşayış və kommersiya obyektləri üçün <strong className="font-semibold text-gray-900">tikinti, təmir, dizayn, lift, qapı və şüşə 
                  sistemləri</strong> üzrə tam paket xidmətlər təqdim edirik.
                </p>
                <p className="leading-relaxed">
                  Məqsədimiz hər layihədə <strong className="font-semibold text-gray-900">keyfiyyət, dəqiqlik və uzunömürlü nəticə</strong> əldə etməkdir. 
                  RC PROF müştərilərinə yalnız iş deyil, <strong className="font-semibold text-gray-900">etibar təqdim edir</strong>.
                </p>
              </div>
              <Link href="/haqqimizda" className="inline-flex items-center text-base font-medium text-gray-900 hover:text-gray-700 transition-colors group">
                Daha çox oxu
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="relative h-[450px] bg-gray-100 overflow-hidden border border-gray-200 animate-slide-in-right">
                  <Image
                    src="/images/about-preview.jpg"
                    alt="RC PROF şirkəti haqqında - Tikinti və texniki həllər"
                    fill
                    className="object-cover"
                    unoptimized={process.env.NODE_ENV === 'development'}
                  />
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-4 tracking-tight">
              Videolar
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Layihələrimiz və xidmətlərimiz haqqında videolar
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videosData.length > 0 ? (
              videosData.slice(0, 3).map((video) => (
                <Link
                  key={video.slug}
                  href={`/videolar/${video.slug}`}
                  className="relative aspect-video bg-gray-200 rounded-sm overflow-hidden border border-gray-300 group cursor-pointer"
                >
                  {video.thumbnail ? (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-300"></div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4">
                    <p className="text-white font-semibold text-sm">{video.title}</p>
                    {video.category && (
                      <p className="text-white/80 text-xs mt-1">{video.category}</p>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <>
                {/* Video Placeholder 1 */}
                <div className="relative aspect-video bg-gray-200 rounded-sm overflow-hidden border border-gray-300 group cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-medium">Layihələrimiz</p>
                  </div>
                </div>
                {/* Video Placeholder 2 */}
                <div className="relative aspect-video bg-gray-200 rounded-sm overflow-hidden border border-gray-300 group cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-medium">Xidmətlərimiz</p>
                  </div>
                </div>
                {/* Video Placeholder 3 */}
                <div className="relative aspect-video bg-gray-200 rounded-sm overflow-hidden border border-gray-300 group cursor-pointer">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-medium">Şirkət haqqında</p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="mt-8 text-center">
            <Link href="/videolar" className="inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors group">
              Bütün videolara bax
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
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
            {servicesData.slice(0, 4).map((service, index) => (
              <Link
                key={service.slug}
                href={`/xidmetler/${service.slug}`}
                className="card card-hover group overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <Image
                    src={`/images/services/${service.slug}.jpg`}
                    alt={`${service.title} - RC PROF xidməti`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-lg">
                      {service.slug === 'tikinti-temir-isleri' && (
                        <svg className="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                      {service.slug === 'dizayn-layihelendirme' && (
                        <svg className="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      )}
                      {service.slug === 'lift-satisi-servisi' && (
                        <svg className="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {service.slug === 'qapi-sistemleri' && (
                        <svg className="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      )}
                      {!['tikinti-temir-isleri', 'dizayn-layihelendirme', 'lift-satisi-servisi', 'qapi-sistemleri'].includes(service.slug) && (
                        <svg className="w-7 h-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-2 text-base md:text-lg font-light leading-relaxed">{service.description}</p>
                  <span className="text-gray-800 font-semibold text-base inline-flex items-center group-hover:translate-x-1 transition-transform">
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
              { text: 'Bir ünvandan tam xidmət', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              { text: 'Peşəkar və təcrübəli komanda', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
              { text: 'Keyfiyyətli materiallar', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { text: 'Vaxtında və dəqiq icra', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              { text: 'Müştəri məmnuniyyəti', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            ].map((item, index) => (
              <div key={index} className="text-center p-8 bg-white hover:bg-gray-50 transition-colors border border-gray-200 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-gray-900 flex items-center justify-center mx-auto mb-6 rounded-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={item.icon}
                    />
                  </svg>
                </div>
                <p className="text-gray-900 font-semibold text-base leading-relaxed">{item.text}</p>
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
            {projectsData.slice(0, 4).map((project, index) => (
              <Link
                key={project.slug}
                href={`/layiheler/${project.slug}`}
                className="card card-hover group overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={`${project.title} - RC PROF layihəsi`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-base md:text-lg line-clamp-2 font-light leading-relaxed">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
            <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-4 tracking-tight">
              Bizimlə əlaqə saxlayın
            </h2>
            <p className="text-lg text-gray-600 font-light">
              Layihəniz üçün pulsuz konsultasiya əldə edin
            </p>
          </div>
          
          <ContactFormSection />
        </div>
      </section>
    </>
  )
}

