'use client'

import { useState, useEffect } from 'react'
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from '@/lib/blogApi'
import MarkdownIt from 'markdown-it'
import type { BlogPost } from '@/lib/blogApi'

const md = new MarkdownIt()

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    fetchBlogs()
  }, [])

  async function fetchBlogs() {
    const fetchedBlogs = await getAllBlogs()
    setBlogs(fetchedBlogs)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (editingId) {
      await updateBlog(editingId, { title, content, excerpt })
    } else {
      await createBlog({ title, content, excerpt })
    }
    setTitle('')
    setContent('')
    setExcerpt('')
    setEditingId(null)
    fetchBlogs()
  }

  async function handleEdit(blog: BlogPost) {
    setTitle(blog.title)
    setContent(blog.content)
    setExcerpt(blog.excerpt || '')
    setEditingId(blog.id)
  }

  async function handleDelete(id: string) {
    await deleteBlog(id)
    fetchBlogs()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Admin</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog title"
          className="w-full p-2 mb-4 border rounded"
          required
        />
        <input
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Blog excerpt (optional)"
          className="w-full p-2 mb-4 border rounded"
        />
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <label className="font-medium">Content (Markdown)</label>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="text-blue-500 hover:text-blue-700"
            >
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
          </div>
          
          {previewMode ? (
            <div 
              className="prose max-w-none p-4 border rounded bg-gray-50"
              dangerouslySetInnerHTML={{ __html: md.render(content) }}
            />
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Blog content (Markdown supported)"
              className="w-full p-2 border rounded font-mono"
              rows={12}
              required
            ></textarea>
          )}
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {editingId ? 'Update Blog' : 'Add Blog'}
        </button>
      </form>

      <div className="space-y-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="p-4 border rounded flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{blog.title}</h2>
              <p className="text-gray-600 text-sm">{new Date(blog.date).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(blog)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(blog.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

