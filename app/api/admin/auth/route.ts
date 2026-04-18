import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'rcprof2025'
const COOKIE_NAME = 'admin_token'
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24

function getCookieValue(token: string, maxAge: number): string {
  const secure = process.env.NODE_ENV === 'production' ? ' Secure;' : ''
  return `${COOKIE_NAME}=${token}; HttpOnly;${secure} SameSite=Strict; Path=/; Max-Age=${maxAge}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (password === ADMIN_PASSWORD) {
      // Timestamp-based token, validated by admin routes (24h lifetime).
      const token = Buffer.from(`${Date.now()}-${Math.random().toString(36).slice(2)}`).toString('base64')
      
      return NextResponse.json(
        { success: true, token },
        { 
          status: 200,
          headers: {
            'Set-Cookie': getCookieValue(token, TOKEN_MAX_AGE_SECONDS),
          }
        }
      )
    } else {
      return NextResponse.json(
        { error: 'Yanlış şifrə' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Xəta baş verdi' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  
  if (!token) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }

  // Simple token validation (in production, use proper JWT validation)
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [timestamp] = decoded.split('-')
    const tokenAge = Date.now() - parseInt(timestamp)
    
    // Token expires after 24 hours
    if (tokenAge > TOKEN_MAX_AGE_SECONDS * 1000) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { authenticated: true },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }
}

export async function DELETE() {
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        'Set-Cookie': getCookieValue('', 0),
      },
    }
  )
}

