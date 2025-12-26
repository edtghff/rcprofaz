import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface Video {
  slug: string
  title: string
  description: string
  videoUrl: string
  thumbnail?: string
  category?: string
  date: string
  duration?: string
}

const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
const dataFilePath = isVercel
  ? path.join('/tmp', 'videos.json')
  : path.join(process.cwd(), 'data', 'videos.json')

function verifyAuth(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value
  if (!token) return false
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [timestamp] = decoded.split('-')
    const tokenAge = Date.now() - parseInt(timestamp)
    return tokenAge < 86400000 // 24 hours
  } catch {
    return false
  }
}

function readVideos(): Video[] {
  if (!fs.existsSync(dataFilePath)) {
    return []
  }
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error reading videos:', error)
    return []
  }
}

function writeVideos(videos: Video[]): void {
  try {
    // Ensure directory exists
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(videos, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing videos:', error)
    throw error
  }
}

// GET - Get all videos
export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const videos = readVideos()
    return NextResponse.json({ videos }, { status: 200 })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST - Create new video
export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const video: Video = await request.json()
    
    // Validate required fields
    if (!video.slug || !video.title || !video.description || !video.videoUrl || !video.date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const videos = readVideos()
    
    // Check if slug already exists
    if (videos.some(v => v.slug === video.slug)) {
      return NextResponse.json({ error: 'Video with this slug already exists' }, { status: 400 })
    }

    videos.push(video)
    writeVideos(videos)

    return NextResponse.json({ message: 'Video created successfully', video }, { status: 201 })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT - Update video
export async function PUT(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { slug, ...updatedVideo } = await request.json()
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const videos = readVideos()
    const index = videos.findIndex(v => v.slug === slug)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    videos[index] = { ...videos[index], ...updatedVideo, slug }
    writeVideos(videos)

    return NextResponse.json({ message: 'Video updated successfully', video: videos[index] }, { status: 200 })
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE - Delete video
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

    const videos = readVideos()
    const filteredVideos = videos.filter(v => v.slug !== slug)
    
    if (videos.length === filteredVideos.length) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    writeVideos(filteredVideos)

    return NextResponse.json({ message: 'Video deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

