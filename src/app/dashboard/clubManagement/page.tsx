"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from 'next/image'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Home, User, Users, Menu, PlusCircle, UserPlus, ClipboardList, Trash2, PencilIcon } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import api from "@/lib/clientApi"
import getAuth from "@/lib/getAuth"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"


const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "undefined";

/**
 * Main component for club management dashboard
 * Handles club attendance, session management, and student management
 */
export default function Component() {
  // State declarations for UI control
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isNavExpanded, setIsNavExpanded] = useState(true)
  
  // State for club management
  const [selectedClub, setSelectedClub] = useState("")
  const [clubs, setClubs] = useState<{ id: string; club_name: string }[]>([])
  const [clubMembers, setClubMembers] = useState([])
  
  // State for dialog controls
  const [isManageStudentsOpen, setIsManageStudentsOpen] = useState(false)
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false)
  const [isEditAttendanceOpen, setIsEditAttendanceOpen] = useState(false)
  const [isEditingSessionName, setIsEditingSessionName] = useState(false)
  
  // State for student management
  const [newStudentId, setNewStudentId] = useState("")
  
  // State for session management
  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState<{ 
    session_name: string; 
    session_date: string; 
    id: number; 
    create_type: string 
  } | null>(null)
  const [sessionStudents, setSessionStudents] = useState<{
    club_student_id: number;
    sign_status: number;
    session_time: number;
    stu_id: string;
    chi_name: string;
    eng_name: string;
  }[]>([])
  
  // State for new session creation
  const [newSessionName, setNewSessionName] = useState("")
  const [newSessionDuration, setNewSessionDuration] = useState("")
  const [newSessionDate, setNewSessionDate] = useState("")
  const [newSessionTimeType, setNewSessionTimeType] = useState("same")
  const [memberTimes, setMemberTimes] = useState<{ [key: string]: string }>({})
  const [editedSessionName, setEditedSessionName] = useState("")
  const { toast } = useToast()

  /**
   * Initial data fetch on component mount
   * Retrieves clubs where user is president or vice president
   */
  useEffect(() => {
    setIsClient(true)
    const fetchClubs = async () => {
      setLoading(true)
      try {
        const session = await getAuth();
        const response = await api.club.presidentClubs(session?.user.api_token || "", session?.user.stu_id || "")
        if (response.code === "0") {
          const allClubs = [...response.data.president_clubs, ...response.data.vice_president_clubs];
          setClubs(allClubs);
          if (allClubs.length > 0) {
            setSelectedClub(allClubs[0].id);
          }
        } else {
          console.error("Failed to fetch clubs:", response.msg)
        }
      } catch (error) {
        console.error("Error fetching clubs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchClubs()
  }, [])

  /**
   * Fetches club members for the selected club
   * @returns Promise<void>
   */
  const fetchClubMembers = useCallback(async () => {
    if (selectedClub) {
      try {
        const session = await getAuth();
        const response = await api.clubMember.list(session?.user?.api_token || "", selectedClub)
        if (response.code === "0") {
          setClubMembers(response.data)
        } else {
          console.error("Failed to fetch club members:", response.msg)
        }
      } catch (error) {
        console.error("Error fetching club members:", error)
      }
    }
  }, [selectedClub])

  /**
   * Handles adding a new student to the club
   * Makes API call and updates local state
   */
  const handleAddStudent = async () => {
    if (newStudentId && selectedClub) {
      try {
        const session = await getAuth();
        const response = await api.clubMember.add(session?.user?.api_token || "", selectedClub, newStudentId)
        if (response.code === "0") {
          await fetchClubMembers()
          setNewStudentId("")
          toast({
            title: "Student added successfully",
            description: "The new student has been added to the club.",
          })
        } else {
          toast({
            title: "Error",
            description: response.msg,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error adding student:", error)
        toast({
          title: "Error",
          description: "Failed to add student",
          variant: "destructive",
        })
      }
    }
  }

  /**
   * Handles removing a student from the club
   * @param memberId - ID of the member to remove
   */
  const handleRemoveStudent = async (memberId: string) => {
    if (selectedClub) {
      try {
        const session = await getAuth();
        const response = await api.clubMember.delete(session?.user?.api_token || "", selectedClub, memberId)
        console.log(response);
        if (response.code === "0") {
          await fetchClubMembers()
          toast({
            title: "Student removed successfully",
            description: "The student has been removed from the club.",
          })
        } else {
          toast({
            title: "Error",
            description: response.msg,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error removing student:", error)
        toast({
          title: "Error",
          description: "Failed to remove student",
          variant: "destructive",
        })
      }
    }
  }

  /**
   * Toggles navigation sidebar expansion state
   * Persists state in localStorage
   */
  const toggleNav = () => {
    setIsNavExpanded((prev: boolean) => {
      const newState = !prev;
      localStorage.setItem('isNavExpanded', JSON.stringify(newState));
      return newState;
    })
  }

  /**
   * Fetches all sessions for the selected club
   * @returns Promise<void>
   */
  const fetchSessions = useCallback(async () => {
    if (selectedClub) {
      try {
        const session = await getAuth();
        const response = await api.session.list(session?.user?.api_token || "", selectedClub)
        if (response.code === "0") {
          setSessions(response.data)
        } else {
          console.error("Failed to fetch sessions:", response.msg)
        }
      } catch (error) {
        console.error("Error fetching sessions:", error)
      }
    }
  }, [selectedClub])

  useEffect(() => {
    if (selectedClub) {
      fetchSessions()
    }
  }, [selectedClub, fetchSessions])

  /**
   * Handles editing attendance for a specific session
   * Fetches student list and opens edit dialog
   * @param session - Session object containing session details
   */
  const handleEditAttendance = async (session: any) => {
    setSelectedSession(session)
    setEditedSessionName(session.session_name)
    try {
      const authSession = await getAuth();
      const response = await api.session.getStudents(authSession?.user?.api_token || "", selectedClub, session.id)
      if (response.code === "0") {
        setSessionStudents(response.data.student_list)
        setIsEditAttendanceOpen(true)
      } else {
        console.error("Failed to fetch session students:", response.msg)
        toast({
          title: "Error",
          description: "Failed to fetch session students",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching session students:", error)
      toast({
        title: "Error",
        description: "Failed to fetch session students",
        variant: "destructive",
      })
    }
  }

  /**
   * Updates attendance status or session time for a student
   * @param clubStudentId - ID of the student in the club
   * @param sessionId - ID of the session
   * @param newStatus - New attendance status (0 or 1)
   * @param newTime - Optional new session time for different time type sessions
   */
  const handleUpdateAttendance = async (clubStudentId: number, sessionId: number, newStatus: number, newTime?: number) => {
    try {
      const authSession = await getAuth();
      let response;
      if (selectedSession?.create_type === 'd' && newTime !== undefined) {
        response = await api.session.setTime(authSession?.user?.api_token || "", clubStudentId.toString(), sessionId.toString(), newTime)
      } else {
        response = await api.session.sign(authSession?.user?.api_token || "", clubStudentId, sessionId, newStatus)
      }
      if (response.code === "0") {
        setSessionStudents((prevStudents) => 
          prevStudents.map((student) => 
            student.club_student_id === clubStudentId 
              ? { ...student, sign_status: newStatus, session_time: newTime || student.session_time } 
              : student
          )
        )
        toast({
          title: "Attendance updated",
          description: "The student's attendance has been updated.",
        })
      } else {
        console.error("Failed to update attendance:", response.msg)
        toast({
          title: "Error",
          description: "Failed to update attendance",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating attendance:", error)
      toast({
        title: "Error",
        description: "Failed to update attendance",
        variant: "destructive",
      })
    }
  }

  /**
   * Deletes a session and its associated attendance records
   * @param sessionId - ID of the session to delete
   */
  const handleDeleteSession = async (sessionId: number) => {
    if (selectedClub) {
      try {
        const session = await getAuth();
        const response = await api.session.delete(session?.user?.api_token || "", selectedClub, sessionId.toString())
        if (response.code === "0") {
          await fetchSessions()
          toast({
            title: "Session deleted",
            description: "The session has been deleted successfully.",
          })
        } else {
          console.error("Failed to delete session:", response.msg)
          toast({
            title: "Error",
            description: "Failed to delete session",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting session:", error)
        toast({
          title: "Error",
          description: "Failed to delete session",
          variant: "destructive",
        })
      }
    }
  }

  /**
   * Creates a new session with specified parameters
   * Handles both fixed and different time type sessions
   */
  const handleAddSession = async () => {
    if (selectedClub && newSessionName && newSessionDate) {
      try {
        const session = await getAuth();
        const createType = newSessionTimeType === "same" ? 'f' : 'd';
        
        let response;
        response = await api.session.add(
          session?.user?.api_token || "",
          selectedClub,
          newSessionName,
          newSessionDuration,
          newSessionDate,
          createType
        );


        if (response.code === "0") {
          toast({
            title: "Session added successfully",
            description: "The new session has been created.",
          });
          await fetchSessions()
          setIsAddSessionOpen(false)
          setNewSessionName("")
          setNewSessionDuration("")
          setNewSessionDate("")
          setNewSessionTimeType("same")
          setMemberTimes({})
        } else {
          toast({
            title: "Error",
            description: response.msg,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error adding session:", error)
        toast({
          title: "Error",
          description: "Failed to add session",
          variant: "destructive",
        });
      }
    }
  }

  /**
   * Updates the name of an existing session
   */
  const handleUpdateSessionName = async () => {
    if (selectedSession && editedSessionName) {
      try {
        const authSession = await getAuth();
        const response = await api.session.modifyName(
          authSession?.user?.api_token || "",
          selectedSession.id.toString(),
          editedSessionName
        )
        if (response.code === "0") {
          setSelectedSession({ ...selectedSession, session_name: editedSessionName })
          toast({
            title: "Session name updated",
            description: "The session name has been updated successfully.",
          })
          fetchSessions()
        } else {
          toast({
            title: "Error",
            description: "Failed to update session name",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error updating session name:", error)
        toast({
          title: "Error",
          description: "Failed to update session name",
          variant: "destructive",
        })
      }
    }
  }

  // Load navigation state from localStorage on mount
  useEffect(() => {
    // 从localStorage读取初始状态
    const savedState = localStorage.getItem('isNavExpanded');
    if (savedState !== null) {
      setIsNavExpanded(JSON.parse(savedState));
    }
  }, []);

  // Client-side rendering guard
  if (!isClient) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className={`bg-white shadow-md transition-all duration-300 ease-in-out ${isNavExpanded ? 'w-64' : 'w-16'} flex flex-col fixed h-full`}>
        <div className="p-4 flex justify-between items-center">
          {isNavExpanded && <span className="text-xl font-bold text-[#0f652c] flex-shrink-0">PH Clubs</span>}
          <button onClick={toggleNav} className="text-gray-500 hover:text-[#0f652c]" aria-label="Toggle navigation">
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-grow">
          <Link 
            href="/dashboard/overview" 
            className="flex items-center p-4 hover:bg-gray-100 text-gray-700"
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
          <Link 
            href="/dashboard/clubManagement" 
            className="flex items-center p-4 hover:bg-gray-100 font-semibold bg-gray-100"
          >
            <div className="w-5 flex-shrink-0">
              <Users className="h-5 w-5" />
            </div>
            {isNavExpanded && <span className="ml-4 whitespace-nowrap">Club Management</span>}
          </Link>
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

      <main className={`flex-1 p-6 ${isNavExpanded ? 'ml-64' : 'ml-16'} transition-all duration-300 ease-in-out overflow-hidden`}>
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-gray-800">Club Attendance</h1>
          
          <div className="flex flex-wrap items-center gap-4">
            {loading ? (
              <Skeleton className="h-10 w-[350px]" />
            ) : (
              <Select onValueChange={setSelectedClub} value={selectedClub}>
                <SelectTrigger className="w-[350px]">
                  <SelectValue placeholder="Select a club" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club: any) => (
                    <SelectItem key={club.id} value={club.id}>
                      {club.club_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Dialog open={isManageStudentsOpen} onOpenChange={(open) => {
              setIsManageStudentsOpen(open)
              if (open) {
                fetchClubMembers()
              }
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" aria-hidden="true" />
                  Manage Students
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Manage Students</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {clubMembers.map((member: any) => (
                      <li key={member.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{member.chi_name} {member.eng_name} ({member.stu_id})</span>
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveStudent(member.id)}>Remove</Button>
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-2">
                    <Label htmlFor="new-student-id">Student ID</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="new-student-id" 
                        value={newStudentId} 
                        onChange={(e) => setNewStudentId(e.target.value)}
                        placeholder="Enter student ID (e.g., 2320610)"
                      />
                      <Button onClick={handleAddStudent}>Add</Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddSessionOpen} onOpenChange={setIsAddSessionOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" aria-hidden="true" />
                  Add Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Session</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-name">Session Name</Label>
                    <Input 
                      id="session-name" 
                      value={newSessionName}
                      onChange={(e) => setNewSessionName(e.target.value)}
                      placeholder="Enter session name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-date">Date</Label>
                    <Input 
                      id="session-date" 
                      type="date"
                      value={newSessionDate}
                      onChange={(e) => setNewSessionDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time Setting</Label>
                    <RadioGroup value={newSessionTimeType} onValueChange={setNewSessionTimeType}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="same" id="same-time" />
                        <Label htmlFor="same-time">Same time for all members</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="different" id="different-time" />
                        <Label htmlFor="different-time">Different time for each member</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {newSessionTimeType === "same" ? (
                    <div className="space-y-2">
                      <Label htmlFor="session-duration">Duration (minutes)</Label>
                      <Input 
                        id="session-duration" 
                        type="number"
                        value={newSessionDuration}
                        onChange={(e) => setNewSessionDuration(e.target.value)}
                        placeholder="Enter duration in minutes" 
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Member Times</Label>
                      {clubMembers.map((member: any) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <Label htmlFor={`member-time-${member.id}`}>{member.chi_name} {member.eng_name}</Label>
                          <Input 
                            id={`member-time-${member.id}`}
                            type="number"
                            placeholder="Duration (minutes)"
                            value={memberTimes[member.id] || ""}
                            onChange={(e) => setMemberTimes(prev => ({ ...prev, [member.id]: e.target.value }))}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <Button className="w-full" onClick={handleAddSession}>Add Session</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden max-h-[calc(100vh-200px)]">
            <div className="overflow-x-auto">
              <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky top-0 bg-white">Session Name</TableHead>
                      <TableHead className="sticky top-0 bg-white">Duration (minutes)</TableHead>
                      <TableHead className="sticky top-0 bg-white">Date</TableHead>
                      <TableHead className="sticky top-0 bg-white">Type</TableHead>
                      <TableHead className="sticky top-0 bg-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session: any) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.session_name}</TableCell>
                        <TableCell>{session.session_time}</TableCell>
                        <TableCell>{session.session_date}</TableCell>
                        <TableCell>{session.create_type === 'f' ? 'Fixed' : 'Different'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => handleEditAttendance(session)} className="flex items-center gap-2">
                              <ClipboardList className="w-4 h-4" aria-hidden="true" />
                              Edit Attendance
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="flex items-center gap-2">
                                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                                  Delete Session
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure you want to delete this session?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the session
                                    &quot;{session.session_name}&quot; and remove all associated attendance records.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => {
                                    handleDeleteSession(session.id)
                                  }}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <Dialog open={isEditAttendanceOpen} onOpenChange={setIsEditAttendanceOpen}>
            <DialogContent className="sm:max-w-[600px] sm:max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Attendance</DialogTitle>
              </DialogHeader>
              {selectedSession && (
                <div className="py-4">
                  <div className="flex items-center space-x-2 mb-4">
                    {isEditingSessionName ? (
                      <div className="flex items-center space-x-2 w-full">
                        <Input
                          value={editedSessionName}
                          onChange={(e) => setEditedSessionName(e.target.value)}
                          placeholder="Session Name"
                          className="flex-1"
                        />
                        <Button 
                          onClick={() => {
                            handleUpdateSessionName()
                            setIsEditingSessionName(false)
                          }}
                          size="sm"
                        >
                          Save
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditedSessionName(selectedSession.session_name)
                            setIsEditingSessionName(false)
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 w-full">
                        <h3 className="text-lg font-semibold flex-1">
                          Session: {selectedSession.session_name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditingSessionName(true)}
                          className="h-8 w-8 p-0"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold mb-4">
                    Date: {selectedSession.session_date}
                  </h3>
                  <ul className="space-y-4">
                    {sessionStudents.map((student) => (
                      <li key={student.club_student_id} className="flex items-center justify-between bg-gray-50 p-4 rounded">
                        <span className="font-medium">
                          {student.chi_name} {student.eng_name} ({student.stu_id})
                        </span>
                        <div className="flex items-center space-x-4">
                          {selectedSession.create_type === 'd' && (
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                value={student.session_time}
                                onChange={(e) => {
                                  const newTime = parseInt(e.target.value, 10);
                                  setSessionStudents((prevStudents) =>
                                    prevStudents.map((s) =>
                                      s.club_student_id === student.club_student_id
                                        ? { ...s, session_time: newTime }
                                        : s
                                    )
                                  );
                                }}
                                className="w-20"
                                placeholder="Minutes"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleUpdateAttendance(student.club_student_id, selectedSession.id, student.sign_status, student.session_time)}
                              >
                                Set
                              </Button>
                            </div>
                          )}
                          <Switch 
                            id={`attendance-${student.club_student_id}`}
                            checked={student.sign_status === 1}
                            onCheckedChange={(checked) => handleUpdateAttendance(student.club_student_id, selectedSession.id, checked ? 1 : 0)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}