'use client'

import { useState, useEffect } from 'react'

interface ContactFormData {
  name: string
  phone: string
  email?: string
  message: string
  source?: string
  timestamp: string
}

export default function AdminPage() {
  const [contacts, setContacts] = useState<ContactFormData[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check authentication on server
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth')
      if (response.ok) {
        const data = await response.json()
        if (data.authenticated) {
          setAuthenticated(true)
          fetchContacts()
        } else {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAuthenticated(true)
          setPassword('')
          fetchContacts()
        } else {
          setError('Yanlış şifrə')
        }
      } else {
        const data = await response.json()
        setError(data.error || 'Yanlış şifrə')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Xəta baş verdi. Yenidən cəhd edin.')
    }
  }

  const handleLogout = async () => {
    try {
      // Clear cookie by setting it to expire
      document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      setAuthenticated(false)
      setPassword('')
      setContacts([])
    } catch (error) {
      console.error('Logout error:', error)
      setAuthenticated(false)
      setPassword('')
      setContacts([])
    }
  }

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/contacts', {
        credentials: 'include', // Include cookies
      })
      
      if (response.status === 401) {
        // Not authenticated, redirect to login
        setAuthenticated(false)
        setLoading(false)
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts || [])
      } else {
        console.error('Failed to fetch contacts')
        if (response.status === 401) {
          setAuthenticated(false)
        }
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('az-AZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 border border-gray-200 max-w-md w-full">
          <div className="mb-6">
            <div className="w-12 h-px bg-gray-900 mb-4"></div>
            <h1 className="text-3xl font-medium text-gray-900 mb-2 tracking-tight">
              Admin Paneli
            </h1>
            <p className="text-gray-600 font-light">Zəhmət olmasa şifrəni daxil edin</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Şifrə
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm font-light"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-300 p-3 text-red-800 text-sm">
                {error}
              </div>
            )}
            
            <button type="submit" className="btn-primary w-full py-2.5">
              Daxil ol
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-medium text-gray-900 tracking-tight">
                Admin Paneli
              </h1>
              <p className="text-gray-600 text-sm font-light mt-1">
                Gələn müraciətlər
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchContacts}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Yenilə
              </button>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Çıxış
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 font-light">Yüklənir...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="bg-white p-12 border border-gray-200 text-center">
            <p className="text-gray-600 font-light">Hələ müraciət yoxdur</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white p-4 border border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                Ümumi müraciət sayı: <span className="text-gray-700">{contacts.length}</span>
              </p>
            </div>
            
            {contacts.map((contact, index) => (
              <div key={index} className="bg-white border border-gray-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-light">
                      {formatDate(contact.timestamp)}
                    </p>
                  </div>
                  {contact.source && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium">
                      {contact.source}
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-gray-800 hover:text-gray-900 font-medium text-sm"
                    >
                      {contact.phone}
                    </a>
                  </div>
                  
                  {contact.email && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-gray-800 hover:text-gray-900 font-medium text-sm"
                      >
                        {contact.email}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-700 text-sm font-light leading-relaxed">
                    {contact.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

