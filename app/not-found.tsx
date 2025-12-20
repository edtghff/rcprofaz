import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Səhifə tapılmadı</h2>
        <p className="text-gray-600 mb-8">
          Axtardığınız səhifə mövcud deyil.
        </p>
        <Link href="/" className="btn-primary">
          Ana səhifəyə qayıt
        </Link>
      </div>
    </div>
  )
}

