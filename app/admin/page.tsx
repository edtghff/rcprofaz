'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Video {
  slug: string
  title: string
  description: string
  videoUrl?: string
  thumbnail?: string
  date: string
}

interface Blog {
  slug: string
  title: string
  excerpt: string
  content?: string
  image: string
  date: string
}

type Tab = 'videos' | 'blogs'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('videos')
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
    date: new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' }),
  })

  const [blogForm, setBlogForm] = useState<Partial<Blog>>({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    image: '',
    date: new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' }),
  })

  const makeSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

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
      await Promise.all([fetchVideos(), fetchBlogs()])
    } finally {
      setLoading(false)
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
      const url = '/api/admin/videos'
      const method = editingVideo ? 'PUT' : 'POST'
      const preparedVideo = editingVideo
        ? { slug: editingVideo.slug, ...videoForm, videoUrl: (videoForm.videoUrl ?? '').trim() }
        : {
            ...videoForm,
            slug: makeSlug(videoForm.title || ''),
            date: new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' }),
            videoUrl: (videoForm.videoUrl ?? '').trim(),
          }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preparedVideo),
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
          date: new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' }),
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
      const preparedBlog = editingBlog
        ? { slug: editingBlog.slug, ...blogForm }
        : {
            ...blogForm,
            slug: makeSlug(blogForm.title || ''),
            date: new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' }),
          }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preparedBlog),
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
            <h1 className="text-3xl font-medium text-gray-900 mb-2 tracking-tight">Sadə Admin</h1>
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
              <h1 className="text-2xl font-medium text-gray-900 tracking-tight">Sadə Admin</h1>
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
            {(['videos', 'blogs'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
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
                          date: new Date().toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' }),
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
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">Başlıq</label>
                          <input
                            type="text"
                            value={videoForm.title || ''}
                            onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">Təsvir</label>
                          <textarea
                            value={videoForm.description || ''}
                            onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            rows={3}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">Video linki (istəyə bağlı)</label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={videoForm.videoUrl || ''}
                              onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                              placeholder="Boş buraxa bilərsiniz — yalnız şəkil üçün"
                              className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
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
                                  multiple={false}
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleFileUpload(file, 'video-file')
                                  }}
                                  disabled={uploadingVideoFile}
                                />
                              </label>
                              {videoForm.videoUrl && (
                                <span className="text-xs text-gray-500">✓ Fayl yükləndi</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="md:col-span-2">
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
                                  multiple={false}
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
                        {video.videoUrl ? (
                          <a
                            href={video.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-600 hover:text-gray-900 break-all"
                          >
                            {video.videoUrl}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-400">Video linki yoxdur (şəkil / mətn)</p>
                        )}
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
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">Başlıq</label>
                          <input
                            type="text"
                            value={blogForm.title || ''}
                            onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">Qısa təsvir</label>
                          <textarea
                            value={blogForm.excerpt || ''}
                            onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
                            rows={2}
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
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">Şəkil</label>
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={blogForm.image || ''}
                              onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                              placeholder="/images/blogs/blog.jpg"
                              className="w-full px-4 py-2 border border-gray-300 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm"
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
                                  multiple={false}
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
