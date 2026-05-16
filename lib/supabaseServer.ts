/** Server-only Supabase env (Vercel: set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY). */
export function getSupabaseServerEnv(): {
  url: string
  serviceRoleKey: string
  bucket: string
} | null {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(
    /\/$/,
    ''
  )
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'media'
  if (!url || !serviceRoleKey) return null
  return { url, serviceRoleKey, bucket }
}
