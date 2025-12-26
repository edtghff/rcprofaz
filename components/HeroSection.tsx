'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <section className="relative h-[70vh] min-h-[500px] bg-gray-900 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        {showVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to image if video fails to load
              const target = e.target as HTMLVideoElement
              target.style.display = 'none'
              setShowVideo(false)
            }}
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>
        ) : null}
        <Image
          src="/images/hero-banner.jpg"
          alt="RC PROF Hero"
          fill
          className={`object-cover ${showVideo ? 'hidden' : 'opacity-40'}`}
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent"></div>
      </div>

      {/* Decorative lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300/30 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-3xl">
          <div className="mb-6">
            <div className="w-16 h-px bg-white mb-4"></div>
          </div>
          <h1 className="text-5xl md:text-7xl font-medium mb-6 tracking-tight leading-tight text-white">
            RC PROF
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 font-light leading-relaxed">
            RC PROF Bakıda tikinti, təmir, dizayn, lift satışı və servisi, qapı və şüşə sistemləri üzrə 
            <strong className="font-semibold text-white"> tam paket korporativ xidmətlər</strong> təqdim edir. 
            Yaşayış və kommersiya obyektləri üçün <strong className="font-semibold text-white">peşəkar həllər</strong> və 
            <strong className="font-semibold text-white"> keyfiyyətli işlər</strong> ilə müştərilərimizin etibarını qazanırıq.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Link href="/elaqe" className="btn-primary inline-flex items-center justify-center bg-white text-gray-900 hover:bg-gray-100">
              Əlaqə
            </Link>
            <Link href="/haqqimizda" className="btn-secondary inline-flex items-center justify-center bg-transparent text-white border-white hover:bg-white/10">
              Haqqımızda
            </Link>
          </div>
          
          {/* Video Play Button */}
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors group"
            aria-label={showVideo ? 'Video bağla' : 'Video izlə'}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all group-hover:scale-110">
              {showVideo ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </div>
            <span className="text-sm font-medium">{showVideo ? 'Video bağla' : 'Təqdimat videosu'}</span>
          </button>
        </div>
      </div>
    </section>
  )
}

