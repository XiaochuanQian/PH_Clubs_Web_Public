import Link from 'next/link'
import { getAllBlogs } from '@/lib/blogApi'
import { BookOpen, FileText, Home, Info } from 'lucide-react'
import { BlogPost } from '@/lib/blogApi'
import Image from "next/image"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Stories() {
  const blogs = await getAllBlogs()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#0f652c]">
            PH Clubs
          </Link>
          <nav className="space-x-6">
            <Link href="/" className="text-gray-600 hover:text-[#0f652c] transition-colors">
              <Home className="inline-block w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link href="/stories" className="text-[#0f652c]">
              <BookOpen className="inline-block w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Stories</span>
            </Link>
            <Link href="/documentation" className="text-gray-600 hover:text-[#0f652c] transition-colors">
              <FileText className="inline-block w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Docs</span>
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-[#0f652c] transition-colors">
              <Info className="inline-block w-4 h-4 mr-1" />
              <span className="hidden sm:inline">About</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <h1 className="text-3xl font-bold mb-6">All Blog Posts</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog: BlogPost) => (
          <Link 
            key={blog.id} 
            href={`/blog/${blog.id}`}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100"
          >
            <h2 className="mb-2 text-xl font-bold">{blog.title}</h2>
            <p className="text-gray-700">{blog.excerpt}</p>
          </Link>
          ))}
        </div>
      </main>
      <footer className="border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600 mt-4">
          © 2023-2024 PH Clubs. All rights reserved. PH Clubs 版权所有
        </div>
        <div className="text-gray-600 text-sm text-center pb-4">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer" className='pr-3'>
            沪ICP备2024103599号-1
          </a>
          <Image
                src="/beian_icon.png"
                alt="beian_icon"
                width={14}
                height={14}
                className='inline'
              />
          <a href="https://beian.mps.gov.cn/#/query/webSearch?" rel="noreferrer" target="_blank" ></a>
        </div>
      </footer>
    </div>
  )
}

