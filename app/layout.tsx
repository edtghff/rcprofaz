import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import FixedContactButtons from '@/components/FixedContactButtons'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rcprof.az'
const siteName = 'RC PROF'
const defaultTitle = 'RC PROF — Tikinti, Təmir, Dizayn, Lift, Qapı və Şüşə Sistemləri'
const defaultDescription = 'RC PROF Bakıda tikinti, təmir, dizayn, lift satışı və servisi, qapı və şüşə sistemləri üzrə korporativ xidmətlər təqdim edir. Peşəkar komanda, keyfiyyətli materiallar və vaxtında icra ilə.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s — ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    'RC PROF',
    'tikinti Bakı',
    'təmir Bakı',
    'dizayn Bakı',
    'lift Bakı',
    'qapı sistemləri Bakı',
    'şüşə sistemləri Bakı',
    'Bakı tikinti',
    'Azərbaycan tikinti',
    'tikinti şirkəti Bakı',
    'təmir işləri Bakı',
    'lift satışı Bakı',
    'lift servisi Bakı',
    'lift montajı Bakı',
    'cam balkon Bakı',
    'qapı montajı Bakı',
    'şüşə montajı Bakı',
    'tikinti xidmətləri Bakı',
    'peşəkar tikinti Bakı',
    'keyfiyyətli tikinti Bakı',
    'tikinti və təmir',
    'tikinti kompaniyası',
    'tikinti xidmətləri Azərbaycan',
    'lift satışı və servisi',
    'qapı və şüşə sistemləri',
    'tikinti dizayn',
    'təmir xidmətləri',
    'dizayn xidmətləri',
    'texniki xidmətlər',
    'tikinti materialları',
    'keyfiyyətli materiallar',
  ],
  authors: [{ name: 'RC PROF' }],
  creator: 'RC PROF',
  publisher: 'RC PROF',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'az_AZ',
    url: siteUrl,
    siteName: siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: '/rcprof.png',
        width: 1200,
        height: 630,
        alt: 'RC PROF Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/rcprof.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'construction',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="az">
      <head>
        <StructuredData />
      </head>
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <FixedContactButtons />
      </body>
    </html>
  )
}

