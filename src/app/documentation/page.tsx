import Link from 'next/link'
import { BookOpen, FileText, Home, Info } from "lucide-react"
import Image from "next/image" 

export default function documentationComponent() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/home" className="text-2xl font-bold text-[#0f652c]">
            PH Clubs
          </Link>
          <nav className="space-x-6">
            <Link href="/home" className="text-gray-600 hover:text-[#0f652c] transition-colors">
              <Home className="inline-block w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link href="/stories" className="text-gray-600 hover:text-[#0f652c] transition-colors">
              <BookOpen className="inline-block w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Stories</span>
            </Link>
            <Link href="/documentation" className="text-[#0f652c]">
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
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Documentation</h1>
        <div className="space-y-8">
          <p>there are currently no avaliable documentations</p>
          {/* <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Getting Started</h2>
            <p className="text-gray-600 mb-4">Welcome to PH Clubs! This guide will help you get started with our platform.</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Create an account</li>
              <li>Set up your club profile</li>
              <li>Invite members</li>
              <li>Create your first event</li>
            </ol>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Member Management</li>
              <li>Event Planning</li>
              <li>Communication Tools</li>
              <li>Financial Tracking</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">FAQs</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">How do I reset my password?</h3>
                <p className="text-gray-600">You can reset your password by clicking on the &quot;Forgot Password&quot; link on the login page.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Can I export member data?</h3>
                <p className="text-gray-600">Yes, you can export member data in CSV format from the Member Management section.</p>
              </div>
            </div>
          </section> */}
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