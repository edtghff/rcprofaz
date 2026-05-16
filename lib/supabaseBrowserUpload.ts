import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

export function getSupabaseBrowser(): SupabaseClient | null {
  if (typeof window === 'undefined') return null
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  if (!url || !key) return null
  if (!browserClient) {
    browserClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return browserClient
}

/** Supabase Storage signed upload (düzgün multipart + apikey). */
export async function uploadViaSignedToken(
  bucket: string,
  objectPath: string,
  token: string,
  file: File
): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = getSupabaseBrowser()
  if (!supabase) {
    return {
      ok: false,
      message:
        'Brauzer yükləməsi üçün Vercel-də NEXT_PUBLIC_SUPABASE_URL və NEXT_PUBLIC_SUPABASE_ANON_KEY (anon public) əlavə edin.',
    }
  }

  const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(objectPath, token, file, {
    contentType: file.type || 'application/octet-stream',
    cacheControl: '3600',
    upsert: true,
  })

  if (error) {
    const raw = error.message || 'Upload failed'
    if (/size|limit|large|payload|413|exceed/i.test(raw)) {
      return {
        ok: false,
        message:
          'Fayl Supabase limitindən böyükdür. Dashboard → Storage → Settings → «Global file size limit» artırın (məs. 200 MB) və ya daha qısa video yükləyin.',
      }
    }
    return { ok: false, message: raw }
  }

  return { ok: true }
}
