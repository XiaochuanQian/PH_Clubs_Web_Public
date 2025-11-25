'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, X, Home, User, Users, Search, Menu, Star } from 'lucide-react'
import api from '@/lib/clientApi'
import getAuth from './getAuth'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ChristmasPuzzle from '@/components/christmasSpecial/hintForChristmasSpecial'

/**
 * Type definitions for club-related data structures
 */
type Club = {
  id: number
  club_name: string
}

type Category = {
  id: number
  category_name: string
  clubs: Club[]
}

type President = {
  chi_name: string
  eng_name: string
  grade: string
}

type ContactInformation = {
  eng_name: string
  email: string
  wechat_id: string
}

type ClubDetails = {
  id: number
  club_name: string
  club_status: string
  star: number
  club_bg_img: string
  is_member: number
  president: President[]
  vice_president: President[]
  club_background: {
    establish_time: string
  }
  learning_objectives: string[]
  for_whom: string[]
  meeting_schedule: {
    frequency: string
    day: string
    location: string
    requirements: string[]
  }
  exp_past_projects: string[]
  join_benefits: string[]
  contact_information: ContactInformation[]
}

/**
 * Application version constant from environment variables
 */
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "undefined";

/**
 * ClubOverview Component
 * Main dashboard component for displaying and managing club information
 * @returns React Component
 */
export default function ClubOverview() {
  // State management for client-side rendering
  const [isClient, setIsClient] = useState(false)
  
  // Loading state for API calls
  const [loading, setLoading] = useState(true)
  
  // State for storing club categories and selected club details
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedClub, setSelectedClub] = useState<ClubDetails | null>(null)
  
  // UI state management
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null)
  const [isNavExpanded, setIsNavExpanded] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClubId, setselectedClubId] = useState<number | null>(null)
  
  // User role state for conditional rendering
  const [userRole, setUserRole] = useState<number | null>(null)
  const [showPuzzle, setShowPuzzle] = useState(false)

  /**
   * Initial data fetch effect
   * Retrieves club categories and user role on component mount
   */
  useEffect(() => {
    setIsClient(true)
    const fetchCategories = async () => {
      setLoading(true)
      const session = await getAuth();
      setUserRole(session?.user?.role_id || null);
      
      try {
        if (session?.user?.api_token) {
          const response = await api.club.getClubCategoryIndex(session.user.api_token)
          if (response.data && Array.isArray(response.data)) {
            setCategories(response.data);
          }
        } else {
          console.error('用户未登录或 API token 不可用');
        }
      } catch (error) {
        console.error('获取俱乐部分类失败:', error);
      } finally {
        setLoading(false)
      }
    };

    fetchCategories();
  }, []);

  /**
   * Navigation state persistence effect
   * Loads saved navigation state from localStorage
   */
  useEffect(() => {
    // 从localStorage读取初始状态
    const savedState = localStorage.getItem('isNavExpanded');
    if (savedState !== null) {
      setIsNavExpanded(JSON.parse(savedState));
    }
  }, []);

  /**
   * Handles club selection and fetches detailed information
   * @param clubId - ID of the selected club
   */
  const handleClubSelect = async (clubId: number) => {
    try {
      const session = await getAuth();
      const response = await api.club.getClubDetail(session?.user.api_token || "", clubId);
      setselectedClubId(clubId);
      if (response.data) {
        setSelectedClub(response.data);
      }
    } catch (error) {
      console.error('获取俱乐部详情失败:', error);
    }
  }

  /**
   * Closes the club details panel
   */
  const handleCloseDetails = () => {
    setSelectedClub(null)
  }

  /**
   * Toggles category expansion in the sidebar
   * @param categoryId - ID of the category to toggle
   */
  const toggleCategory = (categoryId: number) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  /**
   * Toggles navigation sidebar expansion
   * Persists state to localStorage
   */
  const toggleNav = () => {
    setIsNavExpanded((prev: boolean) => {
      const newState = !prev;
      // 保存状态到localStorage
      localStorage.setItem('isNavExpanded', JSON.stringify(newState));
      return newState;
    });
  };

  /**
   * Handles club membership join request
   * @param clubId - ID of the club to join
   */
  const handleJoinClub = async (clubId: number) => {
    console.log(clubId)
    try {
      const session = await getAuth();
      if (session?.user?.api_token) {
        
        const response = await api.clubMember.add(session.user.api_token || "", clubId.toString(), session?.user.stu_id || "");
        if (response.code === "0") {
          setSelectedClub(prevClub => prevClub ? {...prevClub, is_member: 1} : null);
        }else {
          console.error("Somthing went wrong!")
        }
          
      } else {
        console.error('User not logged in or API token unavailable');
      }
    } catch (error) {
      console.error('Failed to join club:', error);
    }
  }

  /**
   * Filters categories and clubs based on search term
   */
  const filteredCategories = categories.map(category => ({
    ...category,
    clubs: category.clubs.filter(club => 
      club.club_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.clubs.length > 0)

  // Client-side rendering guard
  if (!isClient) {
    return null
  }

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Christmas Puzzle Modal Overlay */}
      {/* Fixed positioning to cover entire viewport with z-index 50 to appear above all content */}
      {/* Semi-transparent black background (bg-opacity-50) creates modal effect */}
      {showPuzzle && (
          <ChristmasPuzzle isOpen={showPuzzle} onClose={() => setShowPuzzle(false)} />

      )}

      {/* Main Navigation */}
      <nav className={`bg-white shadow-md transition-all duration-300 ease-in-out ${isNavExpanded ? 'w-64' : 'w-16'} flex flex-col fixed h-full`}>
        <div className="p-4 flex justify-between items-center">
          {isNavExpanded && <span className="text-xl font-bold text-[#0f652c] flex-shrink-0">PH Clubs</span>}
          <button onClick={toggleNav} className="text-gray-500 hover:text-[#0f652c]">
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-grow">
          <Link 
            href="/dashboard/overview" 
            className="flex items-center p-4 hover:bg-gray-100 font-semibold bg-gray-100"
          >
            <div className="w-5 flex-shrink-0">
              <Home className="h-5 w-5" />
            </div>
            {isNavExpanded && <span className="ml-4 whitespace-nowrap">Overview</span>}
          </Link>
          <Link 
            href="/dashboard/personalData" 
            className="flex items-center p-4 hover:bg-gray-100 text-gray-700"
          >
            <div className="w-5 flex-shrink-0">
              <User className="h-5 w-5" />
            </div>
            {isNavExpanded && <span className="ml-4 whitespace-nowrap">Personal Data</span>}
          </Link>
          {userRole === 2 && (
            <Link 
              href="/dashboard/clubManagement" 
              className="flex items-center p-4 hover:bg-gray-100 text-gray-700"
            >
              <div className="w-5 flex-shrink-0">
                <Users className="h-5 w-5" />
              </div>
              {isNavExpanded && <span className="ml-4 whitespace-nowrap">Club Management</span>}
            </Link>
          )}
        </div>
        
        {/* 添加页脚 */}
        <div className="p-4 text-center text-gray-700 text-sm border-t flex items-center justify-center gap-2">
          {isNavExpanded ? (
            <>
              <Image
                src="/ph_club_logo_full.png" // 确保在 public 文件夹中有 logo.png
                alt="PH Clubs Logo"
                width={24}
                height={24}
                onClick={() => setShowPuzzle(true)} // show christmas special modal
              />
              
              <span className="font-bold">PH Clubs Web V{APP_VERSION}</span>
            </>
          ) : (
            <>
              <Image
                src="/ph_club_logo_full.png"
                alt="PH Clubs Logo"
                width={30}
                height={30}
                onClick={() => setShowPuzzle(true)} // show christmas special modal
              />
              
              {/* <span className="font-bold">V{APP_VERSION}</span> */}
            </>
          )}
        </div>
      </nav>

      <div className={`flex-1 p-6 ${isNavExpanded ? 'ml-64' : 'ml-16'} transition-all duration-300 ease-in-out overflow-y-auto`}>
        <h1 className="text-4xl font-bold text-left mb-8">Club Overview</h1>
        <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="w-full md:w-1/3 overflow-y-auto">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search clubs..."
                  className="w-full p-2 pl-8 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f652c]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            {loading ? (
              Array(5).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full mb-4" />
              ))
            ) : (
              filteredCategories.map((category) => (
                <div key={category.id} className="mb-4">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex justify-between items-center w-full bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-semibold">{category.category_name}</span>
                    <ChevronDown className={`transform transition-transform duration-200 ${expandedCategory === category.id ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedCategory === category.id && (
                    <div className="mt-2 space-y-2">
                      {category.clubs.map((club) => (
                        <button
                          key={club.id}
                          onClick={() => handleClubSelect(club.id)}
                          className="w-full text-left p-2 hover:bg-gray-200 rounded transition-colors duration-200"
                        >
                          {club.club_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="w-full md:w-2/3 overflow-y-auto rounded-lg">
            {loading ? (
              <Skeleton className="h-[600px] w-full rounded-lg" />
            ) : selectedClub ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={selectedClub.club_bg_img}
                    alt={selectedClub.club_name}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={handleCloseDetails}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{selectedClub.club_name}</h2>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">{selectedClub.star}</span>
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">Status: {selectedClub.club_status}</p>
                  
                  {/* Join Club button */}
                  <div className="mb-4">
                    <Button 
                      onClick={() =>
                        handleJoinClub(selectedClubId || 0)
                        }
                      disabled={selectedClub.is_member === 1}
                      className="w-full"
                    >
                      {selectedClub.is_member === 1 ? 'Already a Member' : 'Join Club'}
                    </Button>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Presidents:</h3>
                    <ul>
                      {selectedClub.president.map((pres, index) => (
                        <li key={index}>{pres.eng_name} ({pres.chi_name}) - Grade {pres.grade}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Learning Objectives:</h3>
                    <ul className="list-disc pl-5">
                      {selectedClub.learning_objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">For Whom:</h3>
                    <ul className="list-disc pl-5">
                      {selectedClub.for_whom.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Meeting Schedule:</h3>
                    <p>{selectedClub.meeting_schedule.frequency} on {selectedClub.meeting_schedule.day}</p>
                    <p>Location: {selectedClub.meeting_schedule.location}</p>
                    <h4 className="font-semibold mt-2">Requirements:</h4>
                    <ul className="list-disc pl-5">
                      {selectedClub.meeting_schedule.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Join Benefits:</h3>
                    <ul className="list-disc pl-5">
                      {selectedClub.join_benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Contact Information:</h3>
                    {selectedClub.contact_information.map((contact, index) => (
                      <div key={index} className="mb-2">
                        <p>{contact.eng_name}</p>
                        <p>Email: {contact.email}</p>
                        <p>WeChat: {contact.wechat_id}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">Select a club to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
