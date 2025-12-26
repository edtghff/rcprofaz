import { NextRequest, NextResponse } from 'next/server'
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

function writeBlogs(blogs: Blog[]): void {
  try {
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(blogs, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing blogs:', error)
    throw error
  }
}

// GET - Get all blogs
export async function GET(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const blogs = readBlogs()
    return NextResponse.json({ blogs }, { status: 200 })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST - Create new blog
export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const blog: Blog = await request.json()
    
    if (!blog.slug || !blog.title || !blog.excerpt || !blog.image || !blog.date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const blogs = readBlogs()
    
    if (blogs.some(b => b.slug === blog.slug)) {
      return NextResponse.json({ error: 'Blog with this slug already exists' }, { status: 400 })
    }

    blogs.push(blog)
    writeBlogs(blogs)

    return NextResponse.json({ message: 'Blog created successfully', blog }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT - Update blog
export async function PUT(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { slug, ...updatedBlog } = await request.json()
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const blogs = readBlogs()
    const index = blogs.findIndex(b => b.slug === slug)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    blogs[index] = { ...blogs[index], ...updatedBlog, slug }
    writeBlogs(blogs)

    return NextResponse.json({ message: 'Blog updated successfully', blog: blogs[index] }, { status: 200 })
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE - Delete blog
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

    const blogs = readBlogs()
    const filteredBlogs = blogs.filter(b => b.slug !== slug)
    
    if (blogs.length === filteredBlogs.length) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    writeBlogs(filteredBlogs)

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

