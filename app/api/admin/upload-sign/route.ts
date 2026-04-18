import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  ensureSupabaseBucket,
  publicObjectUrl,
  validateUploadMeta,
} from '@/lib/adminStorageShared'

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

/**
 * Returns a signed upload URL so the browser can PUT the file directly to Supabase
 * (bypasses Vercel ~4.5MB request body limit for serverless).
 */
export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const fileName = typeof body.fileName === 'string' ? body.fileName : ''
    const contentType = typeof body.contentType === 'string' ? body.contentType : ''
    const uploadType = body.type as string
    const fileSize = typeof body.fileSize === 'number' ? body.fileSize : Number(body.fileSize)

    if (!fileName || !Number.isFinite(fileSize) || fileSize < 0) {
      return NextResponse.json({ error: 'fileName and fileSize are required' }, { status: 400 })
    }

    const validated = validateUploadMeta(fileName, contentType, fileSize, uploadType)
    if (!validated.ok) {
      return NextResponse.json(
        { error: validated.error, detail: validated.detail },
        { status: validated.status }
      )
    }

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'media'

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json({ error: 'Supabase env vars are not configured' }, { status: 500 })
    }

    await ensureSupabaseBucket(supabaseUrl, supabaseServiceRoleKey, bucket)

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(validated.objectPath, { upsert: true })

    if (error || !data) {
      console.error('[upload-sign]', error)
      return NextResponse.json(
        { error: 'Could not create upload URL', detail: error?.message },
        { status: 500 }
      )
    }

    const publicUrl = publicObjectUrl(supabaseUrl, bucket, validated.objectPath)

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
      publicUrl,
      /** Echo for client FormData upload */
      cacheControl: '3600',
    })
  } catch (e) {
    console.error('[upload-sign]', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
