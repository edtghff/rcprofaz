import { servicesData } from '@/data/servicesData'

export default function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rcprof.az'
  
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RC PROF',
    url: siteUrl,
    logo: `${siteUrl}/rcprof-logo.png`,
    description: 'RC PROF Bakıda tikinti, təmir, dizayn, lift satışı və servisi, qapı və şüşə sistemləri üzrə korporativ xidmətlər təqdim edir.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Çinar Park Biznes Mərkəzi',
      addressLocality: 'Bakı',
      addressCountry: 'AZ',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+994-55-998-19-85',
      email: 'info@rcprof.az',
      contactType: 'customer service',
      areaServed: 'AZ',
      availableLanguage: 'az',
    },
    sameAs: [
      'https://www.facebook.com/share/17uh86RmzR/?mibextid=wwXIfr',
      'https://www.instagram.com/rcprof.az',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RC PROF',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Construction and Renovation Services',
    provider: {
      '@type': 'Organization',
      name: 'RC PROF',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Azerbaijan',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'RC PROF Services',
      itemListElement: servicesData.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.description,
          url: `${siteUrl}/xidmetler/${service.slug}`,
        },
        position: index + 1,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  )
}


