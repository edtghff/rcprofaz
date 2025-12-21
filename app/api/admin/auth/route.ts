import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = 'rcprof2025'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (password === ADMIN_PASSWORD) {
      // Generate a simple token (in production, use JWT or session)
      const token = Buffer.from(`${Date.now()}-${password}`).toString('base64')
      
      return NextResponse.json(
        { success: true, token },
        { 
          status: 200,
          headers: {
            'Set-Cookie': `admin_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
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
  const token = request.cookies.get('admin_token')?.value
  
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
    if (tokenAge > 86400000) {
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

