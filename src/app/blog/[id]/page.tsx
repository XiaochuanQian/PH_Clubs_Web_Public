import { getBlogById } from '@/lib/blogApi'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BlogPost({ params }: { params: { id: string } }) {
  const blog = await getBlogById(params.id)

  if (!blog) {
    return <div>Blog post not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/stories" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to all posts
      </Link>
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <div className="text-gray-600 mb-4">
        {new Date(blog.date).toLocaleDateString()}
      </div>
      <article className="prose prose-lg max-w-none
        prose-headings:text-gray-900
        prose-p:text-gray-700
        prose-a:text-blue-600
        prose-strong:text-gray-900
        prose-code:text-pink-500
        prose-pre:bg-gray-50
        prose-pre:border
        prose-pre:border-gray-200"
        dangerouslySetInnerHTML={{ __html: blog.content }}>
      </article>
    </div>
  )
}

