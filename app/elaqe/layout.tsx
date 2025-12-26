import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Əlaqə',
  description: 'RC PROF ilə əlaqə saxlayın. Bakıda tikinti, təmir, dizayn, lift, qapı və şüşə sistemləri üzrə konsultasiya və xidmətlər. Telefon: +994 55 998 19 85. Çinar Plaza, Bakı.',
  keywords: [
    'RC PROF əlaqə',
    'tikinti şirkəti əlaqə Bakı',
    'tikinti konsultasiya Bakı',
    'tikinti xidmətləri əlaqə',
    'RC PROF telefon',
    'RC PROF ünvan',
    'Bakı tikinti şirkəti əlaqə',
    'tikinti məsləhəti',
    'pulsuz konsultasiya',
    'tikinti şirkəti kontakt',
  ],
  openGraph: {
    title: 'Əlaqə — RC PROF | Bakı',
    description: 'RC PROF ilə əlaqə saxlayın. Bakıda tikinti, təmir, dizayn, lift, qapı və şüşə sistemləri üzrə konsultasiya və xidmətlər.',
    type: 'website',
    locale: 'az_AZ',
    siteName: 'RC PROF',
  },
  twitter: {
    card: 'summary',
    title: 'Əlaqə — RC PROF',
    description: 'RC PROF ilə əlaqə saxlayın. Bakıda tikinti, təmir, dizayn, lift, qapı və şüşə sistemləri üzrə konsultasiya və xidmətlər.',
  },
  alternates: {
    canonical: '/elaqe',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

