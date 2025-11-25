'use server'

import MarkdownIt from 'markdown-it'
import Blog from '@/models/Blog'
import { connectDB } from '@/lib/db'

const md = new MarkdownIt({
  html: true,        // Enable HTML tags in source
  breaks: true,      // Convert '\n' in paragraphs into <br>
  linkify: true      // Autoconvert URL-like text to links
})

export type BlogPost = {
  id: string
  title: string
  content: string
  excerpt?: string
  date: string
}

interface BlogDocument {
  _id: string | any
  title: string
  content: string
  excerpt?: string
  date: Date
  __v: number
}

// 定义更新操作的返回类型
interface BlogUpdateResult extends BlogDocument {
  _id: string;
}

// Add cache control helper
const revalidateCache = { next: { revalidate: 0 } }

export async function getAllBlogs(): Promise<BlogPost[]> {
  try {
    await connectDB()
    // Add cache control to ensure fresh data
    const blogs = await Blog.find({})
      .sort({ date: -1 })
      .lean()
      .exec() as BlogDocument[]
    
    return blogs.map(blog => ({
      id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      date: blog.date.toISOString()
    }))
  } catch (error) {
    console.error('获取所有博客失败:', error)
    throw new Error('获取博客列表失败')
  }
}

export async function createBlog(data: Omit<BlogPost, 'id' | 'date'>) {
  try {
    await connectDB()
    const blog = await Blog.create(data)
    return {
      id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      date: blog.date.toISOString()
    }
  } catch (error) {
    console.error('创建博客失败:', error)
    throw new Error('创建博客失败')
  }
}

export async function updateBlog(id: string, data: Partial<BlogPost>) {
  try {
    await connectDB()
    const blog = await Blog.findByIdAndUpdate(
      id, 
      data, 
      { new: true }
    ).lean() as BlogUpdateResult | null
    
    if (!blog) {
      throw new Error('博客未找到')
    }

    return {
      id: blog._id.toString(),
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || '',
      date: blog.date.toISOString()
    }
  } catch (error) {
    console.error(`更新博客 ID ${id} 失败:`, error)
    if (error instanceof Error && error.message === '博客未找到') {
      throw error
    }
    throw new Error('更新博客失败')
  }
}

export async function deleteBlog(id: string) {
  try {
    await connectDB()
    const result = await Blog.findByIdAndDelete(id)
    if (!result) {
      throw new Error('博客未找到')
    }
  } catch (error) {
    console.error(`删除博客 ID ${id} 失败:`, error)
    if (error instanceof Error && error.message === '博客未找到') {
      throw error
    }
    throw new Error('删除博客失败')
  }
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  try {
    await connectDB()
    // Add cache control to ensure fresh data
    const blog = await Blog.findById(id)
      .lean() as BlogDocument | null
      
    if (!blog) return null
    
    return {
      id: blog._id.toString(),
      title: blog.title,
      content: md.render(blog.content),
      excerpt: blog.excerpt || '',
      date: blog.date.toISOString()
    }
  } catch (error) {
    console.error(`获取博客 ID ${id} 失败:`, error)
    throw new Error('获取博客详情失败')
  }
}
  
  