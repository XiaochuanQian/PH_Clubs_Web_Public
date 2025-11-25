'use client'
import Link from 'next/link'
import { BookOpen, FileText, Home, Info } from "lucide-react"
import { useState } from 'react'
import Image from 'next/image'


// Define content for both languages
const content = {
  en: {
    about: "About PH Clubs",
    introduction: "PH Clubs is a blog website focused on sharing website development experiences and knowledge. On this platform, we share problems encountered during development and their solutions, as well as detailed introductions to various technologies. Through our sharing, we hope to help more developers find solutions to problems in their development process.",
    techStack: "Tech Stack",
    techStackIntro: "PH Clubs is primarily developed using next.js + shadcn technology, and the website runs on Tencent Cloud.",
    nextjs: "next.js: An open-source React frontend development framework written in JavaScript, supporting server-side rendering and static website generation, ideal for building SEO-friendly large applications.",
    shadcn: "shadcn: A convenient design tool that helps developers create user-friendly designs more efficiently.",
    future: "Future Direction",
    futureContent: "Currently, PH Clubs is still in its early stages with a limited number of articles, but we will add more content to enrich the website in the future. Meanwhile, we will continuously improve the page layout and interface, hoping to enhance user experience so that everyone can enjoy better visual presentation while browsing articles."
  },
  zh: {
    about: "关于 PH Clubs",
    introduction: "PH Clubs 是一个专注于分享网站开发经验和知识的技术分享博客。在这个平台上，我会分享开发过程中遇到的问题，以及相应的解决方案，同时也会对一些技术进行详细的介绍。通过我们的分享，我们希望能够帮助更多的开发者在开发过程中找到解决问题的方法。",
    techStack: "技术栈",
    techStackIntro: "PH Clubs 的开发主要采用了next.js + shadcn技术，托管在腾讯云。",
    nextjs: "next.js：是一种用JavaScript编程语言编写的开放源代码的React前端开发框架，它支持服务端渲染和生成静态网站，非常适合用来构建SEO友好的大型应用。",
    shadcn: "shadcn：是一个非常便捷的设计工具，能够帮助开发者更快捷地创建出人性化的设计。",
    future: "发展方向",
    futureContent: "目前PH Clubs还处于刚刚开始的阶段，文章的数量还不是特别多，但我们未来会添加更多的文章以丰富网站的内容。同时，我也将不断改善网页布局和界面，希望能通过提升用户体验，让大家在浏览文章的同时也能享受到更好的视觉享受。"
  }
}

export default function About() {
  const [language, setLanguage] = useState<'en' | 'zh'>('en')
  const t = content[language]

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
            <Link href="/stories" className="text-gray-600 hover:text-[#0f652c] transition-colors">
              <BookOpen className="inline-block w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Stories</span>
            </Link>
            <Link href="/documentation" className="text-gray-600 hover:text-[#0f652c] transition-colors">
              <FileText className="inline-block w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Docs</span>
            </Link>
            <Link href="/about" className=" text-[#0f652c]">
              <Info className="inline-block w-4 h-4 mr-1" />
              <span className="hidden sm:inline">About</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="px-4 py-2 rounded-md bg-[#0f652c] text-white hover:bg-[#0d5424] transition-colors"
          >
            {language === 'en' ? '切换到中文' : 'Switch to English'}
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-gray-900">{t.about}</h1>
        <p className="text-gray-900 mb-8">
          {t.introduction}
        </p>
        
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{t.techStack}</h2>
        <p className="text-gray-600 mb-8">
          {t.techStackIntro}
        </p>
        
        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-8">
          <li>{t.nextjs}</li>
          <li>{t.shadcn}</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{t.future}</h2>
        <p className="text-gray-600">
          {t.futureContent}
        </p>
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
          <a href="https://beian.mps.gov.cn/#/query/webSearch?code=******" rel="noreferrer" target="_blank" ></a>
        </div>
      </footer>
    </div>
  )
}