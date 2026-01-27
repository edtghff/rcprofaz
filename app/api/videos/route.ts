import { NextResponse } from 'next/server'
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

export async function GET() {
  try {
    const videos = readVideos()
    return NextResponse.json({ videos }, { status: 200 })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


