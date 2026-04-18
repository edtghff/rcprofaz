import { NextResponse } from 'next/server'
import { loadVideos } from '@/lib/videosStore'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const videos = await loadVideos()
    return NextResponse.json({ videos }, { status: 200 })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
