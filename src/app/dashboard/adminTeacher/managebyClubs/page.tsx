'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, Users, BookOpen, Search, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import api from '@/lib/clientApi'
import getAuth from '@/lib/getAuth'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowLeft } from 'lucide-react'

type Club = {
  id: number
  club_name: string
}

type Category = {
  id: number
  category_name: string
  clubs: Club[]
}

type Student = {
  id: string
  stu_id: string
  chi_name: string
  eng_name: string
  clubTimes?: { 
    club_id: string
    club_name: string
    total_session_time: number
    total_time_valid: string
  }[]
}
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "undefined";
export default function TeacherDashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      const session = await getAuth();
      
      try {
        if (session?.user?.api_token) {
          const clubResponse = await api.club.getClubCategoryIndex(session.user.api_token)
          if (clubResponse.data && Array.isArray(clubResponse.data)) {
            setCategories(clubResponse.data);
          }
        } else {
          console.error('User not logged in or API token unavailable');
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const fetchClubMembers = async (clubId: number) => {
    const session = await getAuth();
    
    try {
      if (session?.user?.api_token) {
        const studentResponse = await api.clubMember.list(session.user.api_token, clubId.toString())
        if (studentResponse.data && Array.isArray(studentResponse.data)) {
          setStudents(studentResponse.data.map((student: {
            id: string;
            stu_id: string;
            chi_name: string;
            eng_name: string;
          }) => ({
            ...student,
            clubTimes: [] 
          })));
        }
      } else {
        console.error('User not logged in or API token unavailable');
      }
    } catch (error) {
      console.error('Failed to fetch club members:', error);
    }
  };

  const fetchStudentClubTimes = async (stuId: string) => {
    const session = await getAuth();
    
    try {
      if (session?.user?.api_token) {
        const response = await api.student.getClubTime(session.user.api_token, stuId)
        if (response.data && response.data.club_time_list) {
          const updatedStudents = students.map(student => 
            student.stu_id === stuId
              ? { ...student, clubTimes: response.data.club_time_list }
              : student
          );
          setStudents(updatedStudents);
          setSelectedStudent(updatedStudents.find(student => student.stu_id === stuId) || null);
          setIsDialogOpen(true);
        }
      } else {
        console.error('User not logged in or API token unavailable');
      }
    } catch (error) {
      console.error('Failed to fetch student club times:', error);
    }
  };

  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded)
  }

  const handleClubSelect = async (club: Club) => {
    setSelectedClub(club)
    setSelectedStudent(null)
    await fetchClubMembers(club.id)
  }

  const handleToggleClubTime = async (studentId: string, clubId: string, currentState: boolean) => {
    const session = await getAuth();
    if (!session?.user?.api_token) return;
    const newState = !currentState ? 1 : 0;
    try {
      const response = await api.clubMember.setTimeValid(
        session.user.api_token,
        clubId,
        studentId,
        newState
      );
      console.log(clubId, studentId, newState);
      if (selectedStudent) {
        await fetchStudentClubTimes(selectedStudent.stu_id);
      }
    } catch (error) {
      console.error('Failed to toggle club time:', error);
    }
  };

  const filteredCategories = categories.map(category => ({
    ...category,
    clubs: category.clubs.filter(club => 
      club.club_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.clubs.length > 0)

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      <nav className={`bg-white shadow-md transition-all duration-300 ease-in-out ${isNavExpanded ? 'w-64' : 'w-16'} flex flex-col fixed h-full`}>
        <div className="p-4 flex justify-between items-center">
          {isNavExpanded && <span className="text-xl font-bold text-green-800">PH Clubs</span>}
          <button onClick={toggleNav} className="text-gray-500 hover:text-green-800">
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-grow">
          <Link 
            href="/dashboard/adminTeacher/managebyClubs" 
            className="flex items-center p-4 hover:bg-gray-100 font-semibold bg-gray-100"
          >
            <BookOpen className="h-5 w-5" />
            {isNavExpanded && <span className="ml-4">Clubs</span>}
          </Link>
          <Link 
            href="/dashboard/adminTeacher/managebyStudents" 
            className="flex items-center p-4 hover:bg-gray-100 text-gray-700"
          >
            <Users className="h-5 w-5" />
            {isNavExpanded && <span className="ml-4">Students</span>}
          </Link>
        </div>
        
        {/* Add Go Back Button */}
        <div className="px-4 mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard/personalData">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {isNavExpanded && "Go Back"}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go back to logout</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Footer div */}
        <div className="p-4 text-center text-gray-700 text-sm border-t flex items-center justify-center gap-2">
          {isNavExpanded ? (
            <>
              <Image
                src="/ph_club_logo_full.png" // 确保在 public 文件夹中有 logo.png
                alt="PH Clubs Logo"
                width={24}
                height={24}
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
              />
              {/* <span className="font-bold">V{APP_VERSION}</span> */}
            </>
          )}
        </div>
      </nav>

      <div className={`flex-1 p-6 ${isNavExpanded ? 'ml-64' : 'ml-16'} transition-all duration-300 ease-in-out overflow-y-auto`}>
        <h1 className="text-4xl font-bold text-left mb-8">Club Management</h1>
        <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="w-full md:w-1/3 overflow-y-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Club Categories</h2>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search clubs..."
                  className="w-full p-2 pl-8 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            {filteredCategories.map((category) => (
              <div key={category.id} className="mb-4">
                <h3 className="font-semibold mb-2">{category.category_name}</h3>
                {category.clubs.map((club) => (
                  <button
                    key={club.id}
                    onClick={() => handleClubSelect(club)}
                    className="flex justify-between items-center w-full bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 mb-2"
                  >
                    <span>{club.club_name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="w-full md:w-2/3 overflow-y-auto rounded-lg">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">{selectedClub ? selectedClub.club_name : 'Club Members'}</h2>
              {selectedClub ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.eng_name} ({student.chi_name})</TableCell>
                        <TableCell>{student.stu_id}</TableCell>
                        <TableCell>
                          <Button onClick={() => fetchStudentClubTimes(student.stu_id)} variant="outline">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-600 text-center">Select a club to view students</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader className="sticky top-0  z-10">
            <DialogTitle>
              {selectedStudent ? `${selectedStudent.eng_name} (${selectedStudent.chi_name}) - Club Times` : 'Student Details'}
            </DialogTitle>
            <DialogDescription>
              View and manage student&apos;s club attendance records
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Club Name</TableHead>
                    <TableHead>Total Time</TableHead>
                    <TableHead>Valid Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedStudent.clubTimes?.map((clubTime) => (
                    <TableRow key={clubTime.club_id}>
                      <TableCell>{clubTime.club_name}</TableCell>
                      <TableCell>{Math.floor(clubTime.total_session_time / 60)}h {clubTime.total_session_time % 60}m</TableCell>
                      <TableCell>
                        <Switch
                          checked={parseInt(clubTime.total_time_valid) > 0}
                          onCheckedChange={(checked) => handleToggleClubTime(
                            selectedStudent.stu_id, 
                            clubTime.club_id, 
                            parseInt(clubTime.total_time_valid) > 0
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}