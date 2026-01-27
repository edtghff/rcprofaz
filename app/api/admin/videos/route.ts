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
// Primary source: data/videos.json (in repo, read-only on Vercel)
const repoDataPath = path.join(process.cwd(), 'data', 'videos.json')
// Temporary storage: /tmp/videos.json (writable on Vercel, but not persistent)
const tmpDataPath = path.join('/tmp', 'videos.json')

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
  // Try to read from /tmp first (has latest changes)
  if (fs.existsSync(tmpDataPath)) {
    try {
      const fileContent = fs.readFileSync(tmpDataPath, 'utf-8')
      const videos = JSON.parse(fileContent)
      if (Array.isArray(videos) && videos.length > 0) {
        return videos
      }
    } catch (error) {
      console.error('Error reading from /tmp:', error)
    }
  }
  
  // Fallback to repo data file
  if (fs.existsSync(repoDataPath)) {
    try {
      const fileContent = fs.readFileSync(repoDataPath, 'utf-8')
      const videos = JSON.parse(fileContent)
      
      // On Vercel, initialize /tmp with repo data if /tmp doesn't exist
      if (isVercel && !fs.existsSync(tmpDataPath) && Array.isArray(videos)) {
        try {
          const tmpDir = path.dirname(tmpDataPath)
          if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true })
          }
          fs.writeFileSync(tmpDataPath, JSON.stringify(videos, null, 2), 'utf-8')
        } catch (error) {
          console.error('Error initializing /tmp from repo:', error)
        }
      }
      
      return videos
    } catch (error) {
      console.error('Error reading from repo:', error)
    }
  }
  
  return []
}

function writeVideos(videos: Video[]): void {
  try {
    // Always write to /tmp (works on Vercel)
    const tmpDir = path.dirname(tmpDataPath)
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true })
    }
    fs.writeFileSync(tmpDataPath, JSON.stringify(videos, null, 2), 'utf-8')
    
    // Also try to write to repo data file (works locally, read-only on Vercel)
    if (!isVercel) {
      const repoDir = path.dirname(repoDataPath)
      if (!fs.existsSync(repoDir)) {
        fs.mkdirSync(repoDir, { recursive: true })
      }
      fs.writeFileSync(repoDataPath, JSON.stringify(videos, null, 2), 'utf-8')
    }
  } catch (error) {
    console.error('Error writing videos:', error)
    // Don't throw - at least /tmp write should succeed
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

