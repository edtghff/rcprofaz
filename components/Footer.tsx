import Link from 'next/link'
import Image from 'next/image'
import { contactPhone, contactPhoneRaw, contactAddress } from '@/data/navData'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <Link href="/" className="inline-block transition-opacity hover:opacity-80">
                <div className="h-20 w-auto flex items-center">
                  <Image
                    src="/images/logo.png"
                    alt="RC PROF Logo"
                    width={200}
                    height={100}
                    className="h-20 w-auto object-contain"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
              </Link>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm max-w-md font-light">
              RC PROF — tikinti və texniki həllər sahəsində fəaliyyət göstərən çoxprofilli şirkətdir. 
              Biz yaşayış və kommersiya obyektləri üçün tikinti, təmir, dizayn, lift, qapı və şüşə 
              sistemləri üzrə tam paket xidmətlər təqdim edirik.
            </p>
            <p className="text-gray-300 font-medium text-base mb-6">
              Güvənlə yüksələk, inamla addımlayaq!
            </p>
            <div className="flex space-x-3">
              <a
                href={`https://wa.me/${contactPhoneRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 hover:bg-green-700 flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              <a
                href={`tel:${contactPhoneRaw}`}
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="Zəng et"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium text-sm mb-6 tracking-wide uppercase">Səhifələr</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/haqqimizda" className="text-gray-400 hover:text-white transition-colors font-light text-sm">
                  Haqqımızda
                </Link>
              </li>
              <li>
                <Link href="/mehsullarimiz" className="text-gray-400 hover:text-white transition-colors font-light text-sm">
                  Məhsullar
                </Link>
              </li>
              <li>
                <Link href="/layiheler" className="text-gray-400 hover:text-white transition-colors font-light text-sm">
                  Layihələrimiz
                </Link>
              </li>
              <li>
                <Link href="/xidmetler" className="text-gray-400 hover:text-white transition-colors font-light text-sm">
                  Xidmətlərimiz
                </Link>
              </li>
              <li>
                <Link href="/elaqe" className="text-gray-400 hover:text-white transition-colors font-light text-sm">
                  Əlaqə
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-medium text-sm mb-6 tracking-wide uppercase">Xidmətlər</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/xidmetler/tikinti-temir-isleri" className="text-gray-400 hover:text-white transition-colors font-light text-sm">
                  Tikinti və Təmir
                </Link>
              </li>
              <li>
                <Link href="/xidmetler/dizayn-layihelendirme" className="text-gray-400 hover:text-white transition-colors font-light text-sm">
                  Dizayn və Layihələndirmə
                </Link>
              </li>
              <li>
                <Link href="/xidmetler/lift-satisi-servisi" className="text-gray-400 hover:text-white transition-colors font-light text-sm">
                  Lift Satışı və Servisi
                </Link>
              </li>
              <li>
                <Link href="/xidmetler/qapi-sistemleri" className="text-gray-400 hover:text-white transition-colors font-light text-sm">
                  Qapı Sistemləri
                </Link>
              </li>
              <li>
                <Link href="/xidmetler/suse-cam-balkon-sistemleri" className="text-gray-400 hover:text-white transition-colors font-light text-sm">
                  Şüşə və Cam Balkon
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-medium text-sm mb-6 tracking-wide uppercase">Əlaqə</h3>
            <div className="space-y-4">
              <div>
                <a
                  href={`tel:${contactPhoneRaw}`}
                  className="text-white hover:text-gray-300 font-medium text-sm transition-colors"
                >
                  {contactPhone}
                </a>
              </div>
              <div className="text-gray-400 text-sm leading-relaxed font-light">
                {contactAddress}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-xs font-light">&copy; {new Date().getFullYear()} RC PROF. Bütün hüquqlar qorunur.</p>
        </div>
      </div>
    </footer>
  )
}

