import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  createSignedUploadUrlRest,
  ensureSupabaseBucket,
  maxImageBytes,
  maxVideoBytes,
  publicObjectUrl,
  validateUploadMeta,
} from '@/lib/adminStorageShared'
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

    const cfg = getSupabaseServerEnv()
    if (!cfg) {
      return NextResponse.json(
        {
          error: 'Supabase not configured',
          detail:
            'Vercel → Settings → Environment Variables: SUPABASE_URL və SUPABASE_SERVICE_ROLE_KEY əlavə edin, sonra Redeploy.',
        },
        { status: 503 }
      )
    }

    await ensureSupabaseBucket(cfg.url, cfg.serviceRoleKey, cfg.bucket)

    let signedUrl: string | undefined
    let token: string | undefined
    let path: string | undefined

    const supabase = createClient(cfg.url, cfg.serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { data, error } = await supabase.storage
      .from(cfg.bucket)
      .createSignedUploadUrl(validated.objectPath, { upsert: true })

    if (data?.signedUrl && data.token) {
      signedUrl = data.signedUrl
      token = data.token
      path = data.path
    } else {
      if (error) console.error('[upload-sign] SDK:', error.message)
      const rest = await createSignedUploadUrlRest(
        cfg.url,
        cfg.serviceRoleKey,
        cfg.bucket,
        validated.objectPath
      )
      if (rest) {
        signedUrl = rest.signedUrl
        token = rest.token
        path = rest.path
      }
    }

    if (!signedUrl || !token) {
      return NextResponse.json(
        {
          error: 'Could not create upload URL',
          detail: error?.message || 'Supabase Storage imza URL-i yaradılmadı',
        },
        { status: 500 }
      )
    }

    const publicUrl = publicObjectUrl(cfg.url, cfg.bucket, validated.objectPath)

    return NextResponse.json({
      signedUrl,
      token,
      path: path || validated.objectPath,
      bucket: cfg.bucket,
      publicUrl,
      cacheControl: '3600',
      maxVideoMb: Math.round(maxVideoBytes() / (1024 * 1024)),
      maxImageMb: Math.round(maxImageBytes() / (1024 * 1024)),
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Server error'
    console.error('[upload-sign]', e)
    return NextResponse.json({ error: 'Server error', detail: message }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
