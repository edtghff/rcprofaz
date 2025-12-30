import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface Blog {
  slug: string
  title: string
  excerpt: string
  content?: string
  image: string
  date: string
  author?: string
  category?: string
  tags?: string[]
}

const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
const dataFilePath = isVercel
  ? path.join('/tmp', 'blogs.json')
  : path.join(process.cwd(), 'data', 'blogs.json')

function readBlogs(): Blog[] {
  if (!fs.existsSync(dataFilePath)) {
    return []
  }
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error reading blogs:', error)
    return []
  }
}

export async function GET() {
  try {
    const blogs = readBlogs()
    return NextResponse.json({ blogs }, { status: 200 })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


