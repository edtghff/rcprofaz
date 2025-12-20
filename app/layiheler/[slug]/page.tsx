import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { projectsData } from '@/data/projectsData'

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = projectsData.find((p) => p.slug === params.slug)
  
  if (!project) {
    return {
      title: 'Layihə tapılmadı — RC PROF',
    }
  }

  return {
    title: `${project.title} — RC PROF`,
    description: project.description,
  }
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = projectsData.find((p) => p.slug === params.slug)

  if (!project) {
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
            <Link href="/layiheler" className="hover:text-gray-900">Layihələr</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{project.title}</span>
          </nav>
          <div className="mb-4">
            <span className="bg-gray-900 text-white px-3 py-1 text-xs font-medium">
              {project.category}
            </span>
          </div>
          <div className="mb-6">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-medium mb-4 text-gray-900 tracking-tight">{project.title}</h1>
          <p className="text-lg text-gray-600 font-light">{project.description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Image */}
          <div className="relative h-[450px] bg-gray-200 overflow-hidden mb-12 border border-gray-200">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Project Details */}
          <div className="mb-12">
            <div className="mb-6">
              <div className="w-12 h-px bg-gray-900 mb-4"></div>
              <h2 className="text-3xl font-medium text-gray-900 mb-6 tracking-tight">Layihə haqqında</h2>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-gray-700 font-light">
              <p>
                Bu layihə RC PROF tərəfindən uğurla həyata keçirilmişdir. 
                Müştəri tələblərinə uyğun olaraq, yüksək keyfiyyət standartları ilə 
                tamamlanmışdır.
              </p>
              <p>
                Layihə müddəti, istifadə olunmuş materiallar və texniki xüsusiyyətlər 
                haqqında ətraflı məlumat üçün bizimlə əlaqə saxlayın.
              </p>
              <p>
                Bizim komandamız hər bir layihəyə fərdi yanaşır və müştərilərimizin 
                tələblərinə uyğun olaraq ən yaxşı həlləri təqdim edir.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gray-900 p-10 text-center text-white border border-gray-900">
            <h3 className="text-2xl font-medium mb-4">
              Oxşar layihə üçün bizimlə əlaqə saxlayın
            </h3>
            <p className="text-base text-gray-300 mb-6 font-light">
              Peşəkar komandamız sizə kömək etməyə hazırdır.
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

