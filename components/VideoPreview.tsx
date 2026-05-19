'use client'

import { useEffect, useRef } from 'react'

type Props = {
  src: string
  className?: string
}

/** İlk kadrı siyahı kartda göstərmək üçün (thumbnail olmadan lokal video). */
export default function VideoPreview({
  src,
  className = 'absolute inset-0 w-full h-full object-cover',
}: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const seekToPreview = () => {
      const d = el.duration
      if (!Number.isFinite(d) || d <= 0) return
      el.currentTime = Math.min(0.5, d * 0.05)
    }

    el.addEventListener('loadedmetadata', seekToPreview)
    return () => el.removeEventListener('loadedmetadata', seekToPreview)
  }, [src])

  return (
    <video
      ref={ref}
      src={src}
      muted
      playsInline
      preload="metadata"
      className={className}
      aria-hidden
    />
  )
}
