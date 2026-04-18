import fs from 'node:fs'
import path from 'node:path'
import type { Video } from '@/data/videosData'

/** Supabase Storage path inside bucket (single JSON CMS file) */
export const VIDEOS_SITE_JSON_PATH = 'site/videos.json'

function repoVideosPath() {
  return path.join(process.cwd(), 'data', 'videos.json')
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'media'
  if (!url || !key) return null
  return { url, key, bucket }
}

async function tryFetchVideosJson(url: string, headers?: HeadersInit): Promise<Video[] | null> {
  try {
    const res = await fetch(url, { cache: 'no-store', headers })
    if (!res.ok) return null
    const data = JSON.parse(await res.text())
    return Array.isArray(data) ? (data as Video[]) : null
  } catch (e) {
    console.error('[videosStore] fetch failed', url.slice(0, 80), e)
    return null
  }
}

/**
 * Load videos: Supabase public + authed JSON oxunu paralel (sürət üçün), sonra repo faylı.
 */
export async function loadVideos(): Promise<Video[]> {
  const cfg = supabaseConfig()
  if (cfg) {
    const pubUrl = `${cfg.url}/storage/v1/object/public/${cfg.bucket}/${VIDEOS_SITE_JSON_PATH}`
    const authUrl = `${cfg.url}/storage/v1/object/${cfg.bucket}/${VIDEOS_SITE_JSON_PATH}`
    const authHeaders = { Authorization: `Bearer ${cfg.key}`, apikey: cfg.key }

    const [fromPublic, fromAuthed] = await Promise.all([
      tryFetchVideosJson(pubUrl),
      tryFetchVideosJson(authUrl, authHeaders),
    ])

    // Authed cavab CDN keşindən təzə olur; public bəzən köhnə qala bilər
    if (fromAuthed !== null) return fromAuthed
    if (fromPublic !== null) return fromPublic
  }

  const p = repoVideosPath()
  if (fs.existsSync(p)) {
    try {
      const data = JSON.parse(fs.readFileSync(p, 'utf-8'))
      return Array.isArray(data) ? (data as Video[]) : []
    } catch {
      return []
    }
  }
  return []
}

/**
 * Persist full list: Supabase Storage (upsert) when configured; always write local file when not on Vercel.
 */
export async function saveVideos(videos: Video[]): Promise<{ ok: true } | { ok: false; error: string }> {
  const body = JSON.stringify(videos, null, 2)
  const cfg = supabaseConfig()

  if (cfg) {
    const uploadUrl = `${cfg.url}/storage/v1/object/${cfg.bucket}/${VIDEOS_SITE_JSON_PATH}`
    // application/json bəzi Storage konfiqlərində rədd olunur; məzmun UTF-8 JSON olaraq octet-stream göndərilir
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.key}`,
        apikey: cfg.key,
        'Content-Type': 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: Buffer.from(body, 'utf-8'),
    })
    if (!res.ok) {
      const t = await res.text()
      console.error('[videosStore] Supabase save failed', t)
      return { ok: false, error: t.slice(0, 400) }
    }
  }

  const isVercel = process.env.VERCEL === '1'
  if (!isVercel) {
    try {
      const p = repoVideosPath()
      const dir = path.dirname(p)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(p, body, 'utf-8')
    } catch (e) {
      console.error('[videosStore] local write failed', e)
      if (!cfg) return { ok: false, error: 'Local save failed' }
    }
  }

  try {
    fs.writeFileSync(path.join('/tmp', 'videos.json'), body, 'utf-8')
  } catch {
    /* ignore */
  }

  return { ok: true }
}
