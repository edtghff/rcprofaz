import { NextRequest, NextResponse } from 'next/server'
import { loadVideos, saveVideos } from '@/lib/videosStore'

interface Video {
  slug: string
  title: string
  description: string
  videoUrl?: string
  thumbnail?: string
  category?: string
  date: string
  duration?: string
}

function verifyAuth(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return false
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [timestamp] = decoded.split('-')
    const tokenAge = Date.now() - parseInt(timestamp)
    return tokenAge < 86400000
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const videos = await loadVideos()
    return NextResponse.json({ videos }, { status: 200 })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const raw = await request.json()
    const slugIn = typeof raw.slug === 'string' ? raw.slug.trim() : ''
    const titleIn = typeof raw.title === 'string' ? raw.title.trim() : ''
    const descIn = typeof raw.description === 'string' ? raw.description.trim() : ''
    const dateIn = typeof raw.date === 'string' ? raw.date.trim() : ''

    const video: Video = {
      ...raw,
      slug: slugIn || `media-${Date.now()}`,
      title: titleIn || 'Adsız',
      description: descIn || '—',
      date:
        dateIn ||
        new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' }),
      videoUrl: typeof raw.videoUrl === 'string' ? raw.videoUrl.trim() : '',
    }

    const videos = await loadVideos()

    if (videos.some((v) => v.slug === video.slug)) {
      return NextResponse.json({ error: 'Video with this slug already exists' }, { status: 400 })
    }

    videos.push(video)
    const saved = await saveVideos(videos)
    if (!saved.ok) {
      return NextResponse.json({ error: 'Save failed', detail: saved.error }, { status: 500 })
    }

    return NextResponse.json({ message: 'Video created successfully', video }, { status: 201 })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { slug, ...updatedVideo } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const videos = await loadVideos()
    const index = videos.findIndex((v) => v.slug === slug)

    if (index === -1) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const merged = { ...videos[index], ...updatedVideo, slug }
    if (typeof merged.videoUrl === 'string') {
      merged.videoUrl = merged.videoUrl.trim()
    }
    videos[index] = merged
    const saved = await saveVideos(videos)
    if (!saved.ok) {
      return NextResponse.json({ error: 'Save failed', detail: saved.error }, { status: 500 })
    }

    return NextResponse.json({ message: 'Video updated successfully', video: videos[index] }, { status: 200 })
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const videos = await loadVideos()
    const filteredVideos = videos.filter((v) => v.slug !== slug)

    if (videos.length === filteredVideos.length) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const saved = await saveVideos(filteredVideos)
    if (!saved.ok) {
      return NextResponse.json({ error: 'Save failed', detail: saved.error }, { status: 500 })
    }

    return NextResponse.json({ message: 'Video deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
