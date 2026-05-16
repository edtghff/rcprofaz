import { NextRequest, NextResponse } from 'next/server'
import { ensureSupabaseBucket, publicObjectUrl, validateUploadMeta } from '@/lib/adminStorageShared'
import { getSupabaseServerEnv } from '@/lib/supabaseServer'

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
 * Legacy server-side upload (small files only on Vercel — body limit ~4.5 MB).
 * Prefer /api/admin/upload-sign + direct PUT for phones.
 */
export async function POST(request: NextRequest) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const validated = validateUploadMeta(file.name, file.type, file.size, type)
    if (!validated.ok) {
      return NextResponse.json(
        { error: validated.error, detail: validated.detail },
        { status: validated.status }
      )
    }

    const cfg = getSupabaseServerEnv()
    if (!cfg) {
      return NextResponse.json(
        {
          error: 'Supabase not configured',
          detail: 'SUPABASE_URL və SUPABASE_SERVICE_ROLE_KEY Vercel-də təyin olunmalıdır',
        },
        { status: 503 }
      )
    }

    await ensureSupabaseBucket(cfg.url, cfg.serviceRoleKey, cfg.bucket)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadUrl = `${cfg.url}/storage/v1/object/${cfg.bucket}/${validated.objectPath}`
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.serviceRoleKey}`,
        apikey: cfg.serviceRoleKey,
        'x-upsert': 'true',
        'Content-Type': validated.contentType,
      },
      body: buffer,
    })

    if (!uploadResponse.ok) {
      const errorBody = await uploadResponse.text()
      console.error('Supabase upload error:', errorBody)
      return NextResponse.json(
        { error: 'Failed to upload to Supabase Storage', detail: errorBody.slice(0, 500) },
        { status: 500 }
      )
    }

    const publicPath = publicObjectUrl(cfg.url, cfg.bucket, validated.objectPath)

    return NextResponse.json({
      success: true,
      path: publicPath,
      hint:
        buffer.length > 4 * 1024 * 1024
          ? 'Mobil üçün birbaşa yükləmə tövsiyə olunur (upload-sign).'
          : undefined,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
