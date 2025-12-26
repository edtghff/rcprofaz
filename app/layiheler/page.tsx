import Link from 'next/link'
import Image from 'next/image'
import { projectsData } from '@/data/projectsData'

export const metadata = {
  title: 'Layihələrimiz',
  description: 'RC PROF tərəfindən həyata keçirilmiş uğurlu layihələr. Bakıda tikinti, təmir, dizayn, lift, qapı və şüşə sistemləri üzrə tamamlanmış layihələr. Portfolio və referanslar.',
  keywords: [
    'RC PROF layihələri',
    'tikinti layihələri Bakı',
    'təmir layihələri Bakı',
    'dizayn layihələri Bakı',
    'lift layihələri Bakı',
    'tikinti portfolio',
    'uğurlu layihələr Bakı',
    'tikinti referansları',
    'tamamlanmış layihələr',
    'peşəkar layihələr',
  ],
  openGraph: {
    title: 'Layihələrimiz — RC PROF | Bakı',
    description: 'RC PROF tərəfindən həyata keçirilmiş uğurlu layihələr. Bakıda tikinti, təmir, dizayn, lift, qapı və şüşə sistemləri üzrə tamamlanmış layihələr.',
    type: 'website',
    locale: 'az_AZ',
    siteName: 'RC PROF',
    images: [
      {
        url: '/images/projects/project-1.jpg',
        width: 1200,
        height: 630,
        alt: 'RC PROF Layihələri',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Layihələrimiz — RC PROF',
    description: 'RC PROF tərəfindən həyata keçirilmiş uğurlu layihələr.',
  },
  alternates: {
    canonical: '/layiheler',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ProjectsPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-medium mb-5 text-gray-900 tracking-tight">Layihələrimiz</h1>
          <p className="text-xl text-gray-600 font-light">
            Uğurla tamamlanmış layihələrimiz
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-px bg-gray-900"></div>
            </div>
            <h2 className="text-4xl font-medium text-gray-900 text-center mb-4 tracking-tight">Portfolio</h2>
            <p className="text-lg text-gray-600 text-center font-light">Bizim həyata keçirdiyimiz uğurlu layihələr</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData.map((project) => (
              <Link
                key={project.slug}
                href={`/layiheler/${project.slug}`}
                className="group bg-white overflow-hidden hover:shadow-md transition-all border border-gray-200 hover:border-gray-900"
              >
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gray-900 text-white px-3 py-1 text-xs font-medium">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed font-light">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

