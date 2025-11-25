import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { BookOpen, Home, Info, LogIn, FileText, Users } from 'lucide-react'
import { TimelineLayout } from "@/components/timeline/timeline-layout"
import { timelineData } from './timelineData'
import { PageDescriptionBox } from "@/components/page-description-box"
import Image from "next/image"

export default function HomeComponent() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/home" className="text-2xl font-bold text-[#0f652c]">
            PH Clubs
          </Link>
          <nav className="space-x-6">
            <Link href="/home" className="text-[#0f652c]">
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
            <Link href="/about" className="text-gray-600 hover:text-[#0f652c] transition-colors">
              <Info className="inline-block w-4 h-4 mr-1" />
              <span className="hidden sm:inline">About</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 pt-12 mt-16">
        <div className="text-center mb-16">
          <div className="mb-6 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0f652c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-20 h-20"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4 text-gray-900">Welcome to PH Clubs</h1>
          {/* <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Explore our community and resources</p> */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <PageDescriptionBox
            title="Stories"
            description="Read the latest stories on software developement"
            href="/stories"
            icon={<BookOpen className="w-6 h-6" />}
          />
          <PageDescriptionBox
            title="Documentation"
            description="Access guides and resources"
            href="/documentation"
            icon={<FileText className="w-6 h-6" />}
          />
          <PageDescriptionBox
            title="About Us"
            description="Learn more about PH Clubs"
            href="/about"
            icon={<Info className="w-6 h-6" />}
          />
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Changelog</h2>
          <div className="space-y-8 items-center">
            <TimelineLayout items={timelineData} />
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600 mt-4">
          © 2023-2024 PH Clubs. All rights reserved. PH Clubs 版权所有
        </div>
        <div className="text-gray-600 text-sm text-center pb-4">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className='pr-3'>
            沪ICP备2024103599号-1
          </a>
          <Image
                src="/beian_icon.png"
                alt="beian_icon"
                width={14}
                height={14}
                className='inline'
              />
          <a href="https://beian.mps.gov.cn/#/query/webSearch?code=*****" rel="noreferrer" target="_blank" ></a>
        </div>
      </footer>
    </div>
  )
}

