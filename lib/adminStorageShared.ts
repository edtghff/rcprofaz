import path from 'node:path'

export const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif', '.avif', '.bmp']
export const videoExts = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.qt', '.3gp', '.mkv']

const allowedImageTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'image/avif',
  'image/bmp',
  'image/pjpeg',
  'image/x-png',
])

const allowedVideoTypes = new Set([
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
  'video/3gpp',
  'video/3gpp2',
  'video/x-matroska',
  'video/mpeg',
])

export type UploadKind = 'video-thumbnail' | 'video-file' | 'blog-image'

export type ValidatedUpload =
  | { ok: true; folder: string; objectPath: string; isImage: boolean; isVideo: boolean; contentType: string }
  | { ok: false; status: number; error: string; detail?: string }

function classifyFile(fileName: string, mime: string): { isImage: boolean; isVideo: boolean } {
  const ext = path.extname(fileName || '').toLowerCase()
  const m = (mime || '').trim().toLowerCase()
  let isImage = allowedImageTypes.has(m)
  let isVideo = allowedVideoTypes.has(m)
  if (!m || m === 'application/octet-stream') {
    if (imageExts.includes(ext)) isImage = true
    if (videoExts.includes(ext)) isVideo = true
  }
  return { isImage, isVideo }
}

/**
 * Validates metadata for an upload (direct-to-Supabase or server proxy).
 */
export function validateUploadMeta(
  fileName: string,
  mime: string,
  fileSize: number,
  uploadType: string
): ValidatedUpload {
  const ext = path.extname(fileName || '').toLowerCase()
  const { isImage, isVideo } = classifyFile(fileName, mime)

  if (!isImage && !isVideo) {
    return {
      ok: false,
      status: 400,
      error: 'Invalid file type',
      detail: `MIME: "${mime || 'empty'}", uzantı: "${ext || 'yox'}"`,
    }
  }

  const maxImageSize = 25 * 1024 * 1024
  const maxVideoSize = 500 * 1024 * 1024
  if (isImage && fileSize > maxImageSize) {
    return { ok: false, status: 400, error: 'Şəkil çox böyükdür (maks. 25 MB)' }
  }
  if (isVideo && fileSize > maxVideoSize) {
    return { ok: false, status: 400, error: 'Video çox böyükdür (maks. 500 MB)' }
  }

  let folder: string
  if (uploadType === 'video-thumbnail') {
    if (!isImage) return { ok: false, status: 400, error: 'Gözlənilən: şəkil faylı' }
    folder = 'images/videos'
  } else if (uploadType === 'blog-image') {
    if (!isImage) return { ok: false, status: 400, error: 'Gözlənilən: şəkil faylı' }
    folder = 'images/blogs'
  } else if (uploadType === 'video-file') {
    if (!isVideo) return { ok: false, status: 400, error: 'Gözlənilən: video faylı' }
    folder = 'videos'
  } else {
    return { ok: false, status: 400, error: 'Invalid upload type' }
  }

  const extResolved = ext || (isImage ? '.jpg' : '.mp4')
  const safeBase = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extResolved}`
  const objectPath = `${folder}/${safeBase}`
  const contentType =
    mime && mime !== 'application/octet-stream'
      ? mime
      : isImage
        ? 'image/jpeg'
        : 'video/mp4'

  return { ok: true, folder, objectPath, isImage, isVideo, contentType }
}

export function publicObjectUrl(supabaseUrl: string, bucket: string, objectPath: string): string {
  const base = supabaseUrl.replace(/\/$/, '')
  return `${base}/storage/v1/object/public/${bucket}/${objectPath}`
}

export async function ensureSupabaseBucket(
  supabaseUrl: string,
  serviceRoleKey: string,
  bucket: string
): Promise<void> {
  const baseUrl = supabaseUrl.replace(/\/$/, '')
  const headers: Record<string, string> = {
    Authorization: `Bearer ${serviceRoleKey}`,
    apikey: serviceRoleKey,
  }

  const getBucketResponse = await fetch(`${baseUrl}/storage/v1/bucket/${bucket}`, {
    method: 'GET',
    headers,
  })

  if (getBucketResponse.ok) return

  const body = await getBucketResponse.text()
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
