'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, Menu, Users, BookOpen, Search, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import api from '@/lib/clientApi'
import getAuth from '@/lib/getAuth'
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Student = {
  id: string
  stu_id: string
  chi_name: string
  eng_name: string
  class_info: string
  clubTimes?: { 
    club_id: string
    club_name: string
    total_session_time: number
    total_time_valid: string
  }[]
}

type ClassGroup = {
  grade_name: string
  student_list: Student[]
}

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "undefined";

export default function StudentList() {
  const [classGroups, setClassGroups] = useState<ClassGroup[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isNavExpanded, setIsNavExpanded] = useState(true)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [searchScope, setSearchScope] = useState<'selected' | 'all'>('selected')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchStudents = async () => {
      const session = await getAuth()
      if (session?.user?.api_token) {
        try {
          const response = await api.student.getTimeList(session.user.api_token)
          if (response.code === 0 && Array.isArray(response.data)) {
            setClassGroups(response.data)
            if (response.data.length > 0) {
              setSelectedClass(response.data[0].grade_name)
            }
          }
        } catch (error) {
          console.error('Failed to fetch students:', error)
        }
      }
    }

    fetchStudents()
  }, [])

  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded)
  }

  const filteredStudents = (() => {
    const searchFilter = (student: Student) =>
      student.eng_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.chi_name.includes(searchTerm) ||
      student.stu_id.includes(searchTerm);

    if (searchScope === 'all') {
      return classGroups.flatMap(group => group.student_list.filter(searchFilter));
    }

    return selectedClass
      ? classGroups
          .find(group => group.grade_name === selectedClass)
          ?.student_list.filter(searchFilter) || []
      : [];
  })();


  const fetchStudentClubTimes = async (stuId: string) => {
    const session = await getAuth();
    
    try {
      if (session?.user?.api_token) {
        const response = await api.student.getClubTime(session.user.api_token, stuId)
        if (response.data && response.data.club_time_list) {
          const updatedStudent = filteredStudents.find(student => student.stu_id === stuId);
          if (updatedStudent) {
            setSelectedStudent({ ...updatedStudent, clubTimes: response.data.club_time_list });
            setIsDialogOpen(true);
          }
        }
      } else {
        console.error('User not logged in or API token unavailable');
      }
    } catch (error) {
      console.error('Failed to fetch student club times:', error);
    }
  };

  const handleToggleClubTime = async (studentId: string, clubId: string, currentState: boolean) => {
    const session = await getAuth();
    if (!session?.user?.api_token) return;
    const newState = !currentState ? 1 : 0;
    try {
      await api.clubMember.setTimeValid(
        session.user.api_token,
        clubId,
        studentId,
        newState
      );
      if (selectedStudent) {
        await fetchStudentClubTimes(selectedStudent.stu_id);
      }
    } catch (error) {
      console.error('Failed to toggle club time:', error);
    }
  };

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
            className="flex items-center p-4 hover:bg-gray-100 text-gray-700"
          >
            <BookOpen className="h-5 w-5" />
            {isNavExpanded && <span className="ml-4">Clubs</span>}
          </Link>
          <Link 
            href="/dashboard/adminTeacher/managebyStudents" 
            className="flex items-center p-4 hover:bg-gray-100 font-semibold bg-gray-100"
          >
            <Users className="h-5 w-5" />
            {isNavExpanded && <span className="ml-4">Students</span>}
          </Link>
        </div>
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
        <div className="p-4 text-center text-gray-700 text-sm border-t flex items-center justify-center gap-2">
          {isNavExpanded ? (
            <>
              <Image
                src="/ph_club_logo_full.png"
                alt="PH Clubs Logo"
                width={24}
                height={24}
              />
              <span className="font-bold">PH Clubs Web V{APP_VERSION}</span>
            </>
          ) : (
            <Image
              src="/ph_club_logo_full.png"
              alt="PH Clubs Logo"
              width={30}
              height={30}
            />
          )}
        </div>
      </nav>

      <div className={`flex-1 p-6 ${isNavExpanded ? 'ml-64' : 'ml-16'} transition-all duration-300 ease-in-out flex flex-col`}>
        <h1 className="text-3xl font-bold mb-6">Student List</h1>
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <Select value={selectedClass || undefined} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classGroups.map((group) => (
                  <SelectItem key={group.grade_name} value={group.grade_name}>
                    Class {group.grade_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={searchScope} onValueChange={(value: 'selected' | 'all') => setSearchScope(value)}>
              <SelectTrigger >
                <SelectValue placeholder="Search scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="selected">Current Class</SelectItem>
                <SelectItem value="all">All Classes</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[200px]"
            />
          </div>
        </div>
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Class {selectedClass}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-[calc(100vh-270px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>English Name</TableHead>
                    <TableHead>Chinese Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.stu_id}</TableCell>
                      <TableCell>{student.eng_name}</TableCell>
                      <TableCell>{student.chi_name}</TableCell>
                      <TableCell>{student.class_info}</TableCell>
                      <TableCell>
                        <Button onClick={() => fetchStudentClubTimes(student.stu_id)} variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent ? `${selectedStudent.eng_name} (${selectedStudent.chi_name}) - Club Times` : 'Student Details'}
            </DialogTitle>
            <DialogDescription>
              View and manage student&apos;s club attendance records
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <ScrollArea className="h-[400px]">
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
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}