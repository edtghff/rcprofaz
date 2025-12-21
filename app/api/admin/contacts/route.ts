import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface ContactFormData {
  name: string
  phone: string
  email?: string
  message: string
  source?: string
  timestamp: string
}

const ADMIN_PASSWORD = 'rcprof2025'

// Use /tmp directory for Vercel serverless functions (read-write)
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
const dataFilePath = isVercel 
  ? path.join('/tmp', 'contacts.json')
  : path.join(process.cwd(), 'data', 'contacts.json')

function readContacts(): ContactFormData[] {
  if (!fs.existsSync(dataFilePath)) {
    return []
  }
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error reading contacts:', error)
    return []
  }
}

function verifyAuth(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value
  
  if (!token) {
    return false
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    const [timestamp] = decoded.split('-')
    const tokenAge = Date.now() - parseInt(timestamp)
    
    // Token expires after 24 hours
    if (tokenAge > 86400000) {
      return false
    }
    
    return true
  } catch (error) {
    return false
  }
}

export async function GET(request: NextRequest) {
  // Verify authentication
  if (!verifyAuth(request)) {
    return NextResponse.json(
      { error: 'Yetkisiz erişim' },
      { status: 401 }
    )
  }

  try {
    const contacts = readContacts()
    // Return contacts in reverse order (newest first)
    return NextResponse.json({ contacts: contacts.reverse() }, { status: 200 })
  } catch (error) {
    console.error('Error reading contacts:', error)
    return NextResponse.json(
      { error: 'Xəta baş verdi.' },
      { status: 500 }
    )
  }
}

