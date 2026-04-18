import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

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

async function ensureSupabaseBucket(
  supabaseUrl: string,
  serviceRoleKey: string,
  bucket: string
): Promise<void> {
  const baseUrl = supabaseUrl.replace(/\/$/, '')
  const headers = {
    Authorization: `Bearer ${serviceRoleKey}`,
    apikey: serviceRoleKey,
  }

  const getBucketResponse = await fetch(`${baseUrl}/storage/v1/bucket/${bucket}`, {
    method: 'GET',
    headers,
  })

  if (getBucketResponse.ok) return

  const body = await getBucketResponse.text()
  // If bucket does not exist, create a public bucket so uploaded media URLs are reachable from the site.
  if (!getBucketResponse.ok && body.includes('Bucket not found')) {
    const createBucketResponse = await fetch(`${baseUrl}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: bucket,
        name: bucket,
        public: true,
      }),
    })

    if (!createBucketResponse.ok) {
      const createBody = await createBucketResponse.text()
      throw new Error(`Failed to create bucket "${bucket}": ${createBody}`)
    }
    return
  }

  throw new Error(`Failed to access bucket "${bucket}": ${body}`)
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

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'media'

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: 'Supabase env vars are not configured' },
        { status: 500 }
      )
    }

    await ensureSupabaseBucket(supabaseUrl, supabaseServiceRoleKey, bucket)

    // Protect serverless memory and request timeout for mobile uploads.
    const maxImageSize = 10 * 1024 * 1024 // 10 MB
    const maxVideoSize = 120 * 1024 * 1024 // 120 MB
    if (isImage && file.size > maxImageSize) {
      return NextResponse.json({ error: 'Image is too large (max 10MB)' }, { status: 400 })
    }
    if (isVideo && file.size > maxVideoSize) {
      return NextResponse.json({ error: 'Video is too large (max 120MB)' }, { status: 400 })
    }

    let folder: string
    if (type === 'video-thumbnail') {
      if (!isImage) return NextResponse.json({ error: 'Expected image file' }, { status: 400 })
      folder = 'images/videos'
    } else if (type === 'blog-image') {
      if (!isImage) return NextResponse.json({ error: 'Expected image file' }, { status: 400 })
      folder = 'images/blogs'
    } else if (type === 'video-file') {
      if (!isVideo) return NextResponse.json({ error: 'Expected video file' }, { status: 400 })
      folder = 'videos'
    } else {
      return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 })
    }

    const ext = path.extname(file.name) || (isImage ? '.jpg' : '.mp4')
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`
    const objectPath = `${folder}/${fileName}`
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/${bucket}/${objectPath}`
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        apikey: supabaseServiceRoleKey,
        'x-upsert': 'true',
        'Content-Type': file.type || (isImage ? 'image/jpeg' : 'video/mp4'),
      },
      body: buffer,
    })

    if (!uploadResponse.ok) {
      const errorBody = await uploadResponse.text()
      console.error('Supabase upload error:', errorBody)
      return NextResponse.json(
        { error: 'Failed to upload to Supabase Storage' },
        { status: 500 }
      )
    }

    const publicPath = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${objectPath}`
    
    return NextResponse.json({ 
      success: true, 
      path: publicPath,
      fileName: fileName,
    }, { status: 200 })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

