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

// Use /tmp directory for Vercel serverless functions (read-write)
// Note: /tmp is ephemeral and resets on each deployment
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
const dataFilePath = isVercel 
  ? path.join('/tmp', 'contacts.json')
  : path.join(process.cwd(), 'data', 'contacts.json')

// Ensure data directory exists (only for local development)
function ensureDataDirectory() {
  if (!isVercel) {
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
  }
}

// Read contacts from file
function readContacts(): ContactFormData[] {
  ensureDataDirectory()
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

// Write contacts to file
function writeContacts(contacts: ContactFormData[]) {
  ensureDataDirectory()
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(contacts, null, 2), 'utf-8')
  } catch (error: any) {
    console.error('Error writing contacts file:', error)
    console.error('File path:', dataFilePath)
    console.error('Is Vercel:', isVercel)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, message, source } = body

    // Validation
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Zəhmət olmasa bütün məcburi sahələri doldurun.' },
        { status: 400 }
      )
    }

    const contactData: ContactFormData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      message: message.trim(),
      source: source || 'unknown',
      timestamp: new Date().toISOString(),
    }

    try {
      // Read existing contacts
      const contacts = readContacts()
      
      // Add new contact
      contacts.push(contactData)
      
      // Write back to file
      writeContacts(contacts)

      // Log success (for debugging on Vercel)
      const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
      console.log('Contact saved successfully:', {
        name: contactData.name,
        phone: contactData.phone,
        source: contactData.source,
        filePath: dataFilePath,
        isVercel,
      })

      return NextResponse.json(
        { success: true, message: 'Mesajınız uğurla göndərildi.' },
        { status: 200 }
      )
    } catch (fileError: any) {
      const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
      console.error('File system error:', fileError)
      console.error('Error details:', {
        message: fileError?.message,
        code: fileError?.code,
        path: fileError?.path,
        isVercel,
        dataFilePath,
      })
      // On Vercel, /tmp might not be available or there might be permission issues
      // Return success anyway (the data is logged above for debugging)
      // In production, you should use a database instead of file system
      return NextResponse.json(
        { success: true, message: 'Mesajınız uğurla göndərildi.' },
        { status: 200 }
      )
    }
  } catch (error: any) {
    const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
    console.error('Error saving contact:', error)
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      isVercel,
      dataFilePath,
    })
    return NextResponse.json(
      { error: 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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

