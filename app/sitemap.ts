import { MetadataRoute } from 'next'
import { navData } from '@/data/navData'
import { servicesData } from '@/data/servicesData'
import { productsData } from '@/data/productsData'
import { projectsData } from '@/data/projectsData'
import fs from 'fs'
import path from 'path'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rcprof.az'
  
  // Read videos and blogs from JSON files
  const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
  const videosFilePath = isVercel
    ? path.join('/tmp', 'videos.json')
    : path.join(process.cwd(), 'data', 'videos.json')
  const blogsFilePath = isVercel
    ? path.join('/tmp', 'blogs.json')
    : path.join(process.cwd(), 'data', 'blogs.json')

  let videos: any[] = []
  let blogs: any[] = []
  
  try {
    if (fs.existsSync(videosFilePath)) {
      const content = fs.readFileSync(videosFilePath, 'utf-8')
      videos = JSON.parse(content)
    }
  } catch {
    // Ignore errors
  }
  
  try {
    if (fs.existsSync(blogsFilePath)) {
      const content = fs.readFileSync(blogsFilePath, 'utf-8')
      blogs = JSON.parse(content)
    }
  } catch {
    // Ignore errors
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/haqqimizda`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/elaqe`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/videolar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/bloglar`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Navigation pages
  const navPages: MetadataRoute.Sitemap = navData
    .filter(item => !item.dropdown)
    .map(item => ({
      url: `${baseUrl}${item.href}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  // Service pages
  const servicePages: MetadataRoute.Sitemap = servicesData.map(service => ({
    url: `${baseUrl}/xidmetler/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Product pages
  const productPages: MetadataRoute.Sitemap = productsData.map(product => ({
    url: `${baseUrl}/mehsullarimiz/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Project pages
  const projectPages: MetadataRoute.Sitemap = projectsData.map(project => ({
    url: `${baseUrl}/layiheler/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/xidmetler`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mehsullarimiz`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/layiheler`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  // Video pages
  const videoPages: MetadataRoute.Sitemap = videos.map((video: any) => ({
    url: `${baseUrl}/videolar/${video.slug}`,
    lastModified: new Date(video.date || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = blogs.map((blog: any) => ({
    url: `${baseUrl}/bloglar/${blog.slug}`,
    lastModified: new Date(blog.date || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...navPages,
    ...categoryPages,
    ...servicePages,
    ...productPages,
    ...projectPages,
    ...videoPages,
    ...blogPages,
  ]
}

