import Image from 'next/image'

export const metadata = {
  title: 'Haqqımızda',
  description: 'RC PROF — tikinti və texniki həllər sahəsində fəaliyyət göstərən çoxprofilli şirkət. Bakıda tikinti, təmir, dizayn, lift, qapı və şüşə sistemləri üzrə peşəkar xidmətlər. Peşəkar komanda, keyfiyyətli materiallar və müştəri məmnuniyyəti.',
  keywords: [
    'RC PROF haqqında',
    'tikinti şirkəti Bakı',
    'peşəkar tikinti',
    'tikinti komanda',
    'keyfiyyətli tikinti',
    'Bakı tikinti',
  ],
  openGraph: {
    title: 'Haqqımızda — RC PROF',
    description: 'RC PROF haqqında məlumat. Tikinti və texniki həllər sahəsində fəaliyyət göstərən çoxprofilli şirkət.',
    type: 'website',
    images: ['/images/about-main.jpg'],
  },
  alternates: {
    canonical: '/haqqimizda',
  },
}

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-medium mb-5 text-gray-900 tracking-tight">Haqqımızda</h1>
          <p className="text-xl text-gray-600 font-light">
            Güvənlə yüksələk, inamla addımlayaq!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            <div>
              <div className="mb-6">
                <div className="w-12 h-px bg-gray-900 mb-4"></div>
                <h2 className="text-4xl font-medium text-gray-900 mb-8 tracking-tight">Şirkətimiz haqqında</h2>
              </div>
              <div className="space-y-6 text-lg leading-relaxed text-gray-700 font-light">
                <p>
                  RC PROF — tikinti və texniki həllər sahəsində fəaliyyət göstərən çoxprofilli şirkətdir. 
                  Biz yaşayış və kommersiya obyektləri üçün tikinti, təmir, dizayn, lift, qapı və şüşə 
                  sistemləri üzrə tam paket xidmətlər təqdim edirik.
                </p>
                <p>
                  Məqsədimiz hər layihədə keyfiyyət, dəqiqlik və uzunömürlü nəticə əldə etməkdir. 
                  RC PROF müştərilərinə yalnız iş deyil, etibar təqdim edir.
                </p>
                <p>
                  Bizim komandamız peşəkar mütəxəssislərdən ibarətdir və hər bir layihəyə fərdi yanaşırıq. 
                  Müştərilərimizin tələblərinə uyğun olaraq, ən yüksək keyfiyyət standartları ilə işləyirik.
                </p>
              </div>
            </div>
            <div className="relative h-[500px] bg-gray-100 overflow-hidden border border-gray-200">
              <Image
                src="/images/about-main.jpg"
                alt="RC PROF Komanda"
                fill
                className="object-cover"
                unoptimized={process.env.NODE_ENV === 'development'}
              />
            </div>
          </div>

          {/* Why RC PROF Section */}
          <div className="bg-gray-50 p-12 border border-gray-200">
            <div className="flex justify-center mb-8">
              <div className="w-12 h-px bg-gray-900"></div>
            </div>
            <h2 className="text-4xl font-medium text-gray-900 text-center mb-14 tracking-tight">Niyə RC PROF?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Bir ünvandan tam xidmət', desc: 'Bütün tikinti və texniki həllər bir yerdə' },
                { title: 'Peşəkar və təcrübəli komanda', desc: 'İllərin təcrübəsi ilə işləyirik' },
                { title: 'Keyfiyyətli materiallar', desc: 'Yalnız sərt keyfiyyət standartları' },
                { title: 'Vaxtında və dəqiq icra', desc: 'Layihələri vaxtında tamamlayırıq' },
                { title: 'Müştəri məmnuniyyəti', desc: 'Müştərilərimiz bizim prioritetimizdir' },
              ].map((item, index) => (
                <div key={index} className="bg-white p-6 border border-gray-200">
                  <div className="w-10 h-10 bg-gray-900 flex items-center justify-center mb-4">
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
                  <h3 className="text-base font-medium text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 font-light">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

