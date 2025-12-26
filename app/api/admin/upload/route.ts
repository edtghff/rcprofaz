import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { writeFile } from 'fs/promises'

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

export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'video-thumbnail', 'blog-image', 'video-file'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']
    
    const isImage = allowedImageTypes.includes(file.type)
    const isVideo = allowedVideoTypes.includes(file.type)

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Determine upload directory based on type
    let uploadDir: string
    let fileName: string
    const isVercel = process.env.VERCEL === '1'

    if (type === 'video-thumbnail' || type === 'blog-image') {
      if (!isImage) {
        return NextResponse.json({ error: 'Expected image file' }, { status: 400 })
      }
      // On Vercel, files are temporary, so we return a URL or use a CDN
      // For now, we'll save to /tmp and return a note that files need to be uploaded to public folder
      if (isVercel) {
        // On Vercel, we can't write to public folder, so we'll save to /tmp
        // and return instructions or use a different approach
        uploadDir = path.join('/tmp', type === 'video-thumbnail' ? 'videos' : 'blogs')
      } else {
        uploadDir = type === 'video-thumbnail' 
          ? path.join(process.cwd(), 'public', 'images', 'videos')
          : path.join(process.cwd(), 'public', 'images', 'blogs')
      }
      
      const ext = path.extname(file.name)
      fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`
    } else if (type === 'video-file') {
      if (!isVideo) {
        return NextResponse.json({ error: 'Expected video file' }, { status: 400 })
      }
      if (isVercel) {
        uploadDir = path.join('/tmp', 'videos')
      } else {
        uploadDir = path.join(process.cwd(), 'public', 'videos')
      }
      const ext = path.extname(file.name)
      fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`
    } else {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 })
    }

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await writeFile(filePath, buffer)

    // Return relative path
    let relativePath: string
    if (isVercel) {
      // On Vercel, files in /tmp are temporary
      // Return a path that indicates the file needs to be moved to public folder
      // For production, you might want to use a CDN or object storage
      relativePath = type === 'video-thumbnail' 
        ? `/images/videos/${fileName}`
        : type === 'blog-image'
        ? `/images/blogs/${fileName}`
        : `/videos/${fileName}`
    } else {
      relativePath = filePath.replace(path.join(process.cwd(), 'public'), '')
    }
    
    return NextResponse.json({ 
      success: true, 
      path: relativePath,
      fileName: fileName,
      note: isVercel ? 'File saved to /tmp. For production, consider using a CDN or object storage.' : undefined
    }, { status: 200 })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

