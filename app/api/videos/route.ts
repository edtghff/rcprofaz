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
const dataFilePath = isVercel
  ? path.join('/tmp', 'videos.json')
  : path.join(process.cwd(), 'data', 'videos.json')

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

export async function GET() {
  try {
    const videos = readVideos()
    return NextResponse.json({ videos }, { status: 200 })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

