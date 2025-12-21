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

const dataFilePath = path.join(process.cwd(), 'data', 'contacts.json')

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
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
  fs.writeFileSync(dataFilePath, JSON.stringify(contacts, null, 2), 'utf-8')
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

    // Read existing contacts
    const contacts = readContacts()
    
    // Add new contact
    contacts.push(contactData)
    
    // Write back to file
    writeContacts(contacts)

    return NextResponse.json(
      { success: true, message: 'Mesajınız uğurla göndərildi.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error saving contact:', error)
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

