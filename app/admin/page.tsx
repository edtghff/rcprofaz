'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ContactFormData {
  name: string
  phone: string
  email?: string
  message: string
  source?: string
  timestamp: string
}

interface Video {
  slug: string
  title: string
  description: string
  videoUrl: string
  thumbnail?: string
  category?: string
  date: string
  duration?: string
}

interface Blog {
  slug: string
  title: string
  excerpt: string
  content?: string
  image: string
  date: string
  author?: string
  category?: string
  tags?: string[]
}

type Tab = 'contacts' | 'videos' | 'blogs'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('contacts')
  const [contacts, setContacts] = useState<ContactFormData[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [showVideoForm, setShowVideoForm] = useState(false)
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [uploadingVideoThumbnail, setUploadingVideoThumbnail] = useState(false)
  const [uploadingVideoFile, setUploadingVideoFile] = useState(false)
  const [uploadingBlogImage, setUploadingBlogImage] = useState(false)

  // Form states
  const [videoForm, setVideoForm] = useState<Partial<Video>>({
    slug: '',
    title: '',
    description: '',
    videoUrl: '',
    thumbnail: '',
    category: '',
    date: new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' }),
    duration: '',
  })

  const [blogForm, setBlogForm] = useState<Partial<Blog>>({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    image: '',
    date: new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' }),
    author: 'RC PROF',
    category: '',
    tags: [],
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        if (data.authenticated) {
          setAuthenticated(true)
          fetchAllData()
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include',
      })

      if (response.ok) {
        setAuthenticated(true)
        setPassword('')
        fetchAllData()
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
      await fetch('/api/admin/auth', { method: 'DELETE', credentials: 'include' })
      setAuthenticated(false)
      setPassword('')
      setContacts([])
      setVideos([])
      setBlogs([])
    } catch (error) {
      console.error('Logout error:', error)
      setAuthenticated(false)
    }
  }

  const fetchAllData = async () => {
    setLoading(true)
    try {
      await Promise.all([fetchContacts(), fetchVideos(), fetchBlogs()])
    } finally {
      setLoading(false)
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contacts', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts || [])
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    }
  }

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/admin/videos', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos || [])
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    }
  }

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/admin/blogs', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.blogs || [])
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    }
  }

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingVideo
        ? '/api/admin/videos'
        : '/api/admin/videos'
      const method = editingVideo ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingVideo ? { slug: editingVideo.slug, ...videoForm } : videoForm),
        credentials: 'include',
      })

      if (response.ok) {
        setShowVideoForm(false)
        setEditingVideo(null)
        setVideoForm({
          slug: '',
          title: '',
          description: '',
          videoUrl: '',
          thumbnail: '',
          category: '',
          date: new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' }),
          duration: '',
        })
        fetchVideos()
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Xəta baş verdi')
      }
    } catch (error) {
      console.error('Error saving video:', error)
      alert('Xəta baş verdi')
    }
  }

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = '/api/admin/blogs'
      const method = editingBlog ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBlog ? { slug: editingBlog.slug, ...blogForm } : blogForm),
        credentials: 'include',
      })

      if (response.ok) {
        setShowBlogForm(false)
        setEditingBlog(null)
        setBlogForm({
          slug: '',
          title: '',
          excerpt: '',
          content: '',
          image: '',
          date: new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' }),
          author: 'RC PROF',
          category: '',
          tags: [],
        })
        fetchBlogs()
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || 'Xəta baş verdi')
      }
    } catch (error) {
      console.error('Error saving blog:', error)
      alert('Xəta baş verdi')
    }
  }

  const handleDeleteVideo = async (slug: string) => {
    if (!confirm('Bu videonu silmək istədiyinizə əminsiniz?')) return
    
    try {
      const response = await fetch(`/api/admin/videos?slug=${slug}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        fetchVideos()
        router.refresh()
      } else {
        alert('Xəta baş verdi')
      }
    } catch (error) {
      console.error('Error deleting video:', error)
      alert('Xəta baş verdi')
    }
  }

  const handleDeleteBlog = async (slug: string) => {
    if (!confirm('Bu blogu silmək istədiyinizə əminsiniz?')) return
    
    try {
      const response = await fetch(`/api/admin/blogs?slug=${slug}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        fetchBlogs()
        router.refresh()
      } else {
        alert('Xəta baş verdi')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Xəta baş verdi')
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

  const handleFileUpload = async (file: File, type: 'video-thumbnail' | 'video-file' | 'blog-image') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      if (type === 'video-thumbnail') setUploadingVideoThumbnail(true)
      if (type === 'video-file') setUploadingVideoFile(true)
      if (type === 'blog-image') setUploadingBlogImage(true)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        
        if (type === 'video-thumbnail') {
          setVideoForm({ ...videoForm, thumbnail: data.path })
        } else if (type === 'video-file') {
          setVideoForm({ ...videoForm, videoUrl: data.path })
        } else if (type === 'blog-image') {
          setBlogForm({ ...blogForm, image: data.path })
        }

        return data.path
      } else {
        const error = await response.json()
        alert(error.error || 'Fayl yüklənərkən xəta baş verdi')
        return null
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Fayl yüklənərkən xəta baş verdi')
      return null
    } finally {
      if (type === 'video-thumbnail') setUploadingVideoThumbnail(false)
      if (type === 'video-file') setUploadingVideoFile(false)
      if (type === 'blog-image') setUploadingBlogImage(false)
    }
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
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Çıxış
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {(['contacts', 'videos', 'blogs'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'contacts' && 'Müraciətlər'}
                {tab === 'videos' && 'Videolar'}
                {tab === 'blogs' && 'Bloglar'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 font-light">Yüklənir...</p>
          </div>
        ) : (
          <>
            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium text-gray-900">Müraciətlər</h2>
                  <button
                    onClick={fetchContacts}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Yenilə
                  </button>
                </div>
                {contacts.length === 0 ? (
                  <div className="bg-white p-12 border border-gray-200 text-center">
                    <p className="text-gray-600 font-light">Hələ müraciət yoxdur</p>
                  </div>
                ) : (
                  <div className="space-y-4">
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
                            <a href={`tel:${contact.phone}`} className="text-gray-800 hover:text-gray-900 font-medium text-sm">
                              {contact.phone}
                            </a>
                          </div>
                          {contact.email && (
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <a href={`mailto:${contact.email}`} className="text-gray-800 hover:text-gray-900 font-medium text-sm">
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
              </div>
            )}

            {/* Videos Tab */}
            {activeTab === 'videos' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium text-gray-900">Videolar</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingVideo(null)
                        setVideoForm({
                          slug: '',
                          title: '',
                          description: '',
                          videoUrl: '',
                          thumbnail: '',
                          category: '',
                          date: new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' }),
                          duration: '',
                        })
                        setShowVideoForm(true)
                      }}
                      className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 transition-colors"
                    >
                      + Yeni Video
                    </button>
                    <button
                      onClick={fetchVideos}
                      className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Yenilə
                    </button>
                  </div>
                </div>

                {showVideoForm && (
                  <div className="bg-white border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingVideo ? 'Videonu redaktə et' : 'Yeni video əlavə et'}
                    </h3>
                    <form onSubmit={handleVideoSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Slug *</label>
                          <input
                            type="text"
                            value={videoForm.slug || ''}
                            onChange={(e) => setVideoForm({ ...videoForm, slug: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            required
                            disabled={!!editingVideo}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Tarix *</label>
                          <input
                            type="text"
                            value={videoForm.date || ''}
                            onChange={(e) => setVideoForm({ ...videoForm, date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">Başlıq *</label>
                          <input
                            type="text"
                            value={videoForm.title || ''}
                            onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">Təsvir *</label>
                          <textarea
                            value={videoForm.description || ''}
                            onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            rows={3}
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">Video URL *</label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={videoForm.videoUrl || ''}
                              onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                              placeholder="https://www.youtube.com/watch?v=... və ya https://vimeo.com/... və ya fayl yükləyin"
                              className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                              required
                            />
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                {uploadingVideoFile ? 'Yüklənir...' : 'Video faylı yüklə'}
                                <input
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleFileUpload(file, 'video-file')
                                  }}
                                  disabled={uploadingVideoFile}
                                />
                              </label>
                              {videoForm.videoUrl && videoForm.videoUrl.startsWith('/videos/') && (
                                <span className="text-xs text-gray-500">✓ Fayl yükləndi</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Thumbnail</label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={videoForm.thumbnail || ''}
                              onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                              placeholder="/images/videos/video.jpg"
                              className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            />
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {uploadingVideoThumbnail ? 'Yüklənir...' : 'Şəkil yüklə'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleFileUpload(file, 'video-thumbnail')
                                  }}
                                  disabled={uploadingVideoThumbnail}
                                />
                              </label>
                              {videoForm.thumbnail && (
                                <span className="text-xs text-gray-500">✓ Şəkil yükləndi</span>
                              )}
                            </div>
                            {videoForm.thumbnail && (
                              <div className="mt-2">
                                <img src={videoForm.thumbnail} alt="Preview" className="max-w-xs h-32 object-cover border border-gray-200 rounded" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Kateqoriya</label>
                          <input
                            type="text"
                            value={videoForm.category || ''}
                            onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Müddət</label>
                          <input
                            type="text"
                            value={videoForm.duration || ''}
                            onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                            placeholder="5:30"
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="btn-primary px-6 py-2">
                          {editingVideo ? 'Yadda saxla' : 'Əlavə et'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowVideoForm(false)
                            setEditingVideo(null)
                          }}
                          className="px-6 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          Ləğv et
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {videos.length === 0 ? (
                  <div className="bg-white p-12 border border-gray-200 text-center">
                    <p className="text-gray-600 font-light">Hələ video yoxdur</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videos.map((video) => (
                      <div key={video.slug} className="bg-white border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{video.title}</h3>
                            <p className="text-sm text-gray-600 font-light">{video.date}</p>
                            {video.category && (
                              <span className="inline-block mt-2 bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium">
                                {video.category}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingVideo(video)
                                setVideoForm(video)
                                setShowVideoForm(true)
                              }}
                              className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1 border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                              Redaktə
                            </button>
                            <button
                              onClick={() => handleDeleteVideo(video.slug)}
                              className="text-sm font-medium text-red-700 hover:text-red-900 px-3 py-1 border border-red-300 hover:bg-red-50 transition-colors"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm font-light mb-2">{video.description}</p>
                        <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-gray-900">
                          {video.videoUrl}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Blogs Tab */}
            {activeTab === 'blogs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium text-gray-900">Bloglar</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingBlog(null)
                        setBlogForm({
                          slug: '',
                          title: '',
                          excerpt: '',
                          content: '',
                          image: '',
                          date: new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' }),
                          author: 'RC PROF',
                          category: '',
                          tags: [],
                        })
                        setShowBlogForm(true)
                      }}
                      className="text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 transition-colors"
                    >
                      + Yeni Blog
                    </button>
                    <button
                      onClick={fetchBlogs}
                      className="text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Yenilə
                    </button>
                  </div>
                </div>

                {showBlogForm && (
                  <div className="bg-white border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingBlog ? 'Blogu redaktə et' : 'Yeni blog əlavə et'}
                    </h3>
                    <form onSubmit={handleBlogSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Slug *</label>
                          <input
                            type="text"
                            value={blogForm.slug || ''}
                            onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            required
                            disabled={!!editingBlog}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Tarix *</label>
                          <input
                            type="text"
                            value={blogForm.date || ''}
                            onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">Başlıq *</label>
                          <input
                            type="text"
                            value={blogForm.title || ''}
                            onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">Qısa təsvir *</label>
                          <textarea
                            value={blogForm.excerpt || ''}
                            onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            rows={2}
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">Məzmun</label>
                          <textarea
                            value={blogForm.content || ''}
                            onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            rows={6}
                            placeholder="Tam mətn (boş ola bilər, qısa təsvir istifadə olunacaq)"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Şəkil *</label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={blogForm.image || ''}
                              onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                              placeholder="/images/blogs/blog.jpg"
                              className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                              required
                            />
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {uploadingBlogImage ? 'Yüklənir...' : 'Şəkil yüklə'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleFileUpload(file, 'blog-image')
                                  }}
                                  disabled={uploadingBlogImage}
                                />
                              </label>
                              {blogForm.image && (
                                <span className="text-xs text-gray-500">✓ Şəkil yükləndi</span>
                              )}
                            </div>
                            {blogForm.image && (
                              <div className="mt-2">
                                <img src={blogForm.image} alt="Preview" className="max-w-xs h-32 object-cover border border-gray-200 rounded" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Müəllif</label>
                          <input
                            type="text"
                            value={blogForm.author || ''}
                            onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Kateqoriya</label>
                          <input
                            type="text"
                            value={blogForm.category || ''}
                            onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Teqlər (vergüllə ayrılmış)</label>
                          <input
                            type="text"
                            value={Array.isArray(blogForm.tags) ? blogForm.tags.join(', ') : ''}
                            onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                            placeholder="tikinti, tips, layihə"
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="btn-primary px-6 py-2">
                          {editingBlog ? 'Yadda saxla' : 'Əlavə et'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowBlogForm(false)
                            setEditingBlog(null)
                          }}
                          className="px-6 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          Ləğv et
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {blogs.length === 0 ? (
                  <div className="bg-white p-12 border border-gray-200 text-center">
                    <p className="text-gray-600 font-light">Hələ blog yoxdur</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blogs.map((blog) => (
                      <div key={blog.slug} className="bg-white border border-gray-200 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">{blog.title}</h3>
                            <p className="text-sm text-gray-600 font-light">{blog.date}</p>
                            {blog.category && (
                              <span className="inline-block mt-2 bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-medium">
                                {blog.category}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingBlog(blog)
                                setBlogForm(blog)
                                setShowBlogForm(true)
                              }}
                              className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1 border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                              Redaktə
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.slug)}
                              className="text-sm font-medium text-red-700 hover:text-red-900 px-3 py-1 border border-red-300 hover:bg-red-50 transition-colors"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm font-light mb-2">{blog.excerpt}</p>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {blog.tags.map((tag, idx) => (
                              <span key={idx} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
