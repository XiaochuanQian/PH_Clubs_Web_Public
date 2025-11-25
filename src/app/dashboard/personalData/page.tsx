/**
 * Personal Data Dashboard Page
 * 
 * This component displays a user's personal information, club participation,
 * and time statistics in a dashboard layout. It includes functionality for
 * password management, navigation, and club membership management.
 * 
 * @module PersonalData
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Home, User, Users, Menu, Lock, LogOut } from "lucide-react"
import api from "@/lib/clientApi"
import getAuth from "@/lib/getAuth"
import { logout } from "@/lib/logout"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


// Type definitions
/**
 * Type definition for club information
 * @typedef {Object} ClubInfo
 */
type ClubInfo = {
  club_id: string;
  club_member_id: string;
  club_name: string;
  participation: string;
  bg_color: 'red' | 'yellow' | 'green';
  total_time: number;
  valid: number;
};

type TimeInfo = {
  club_name: string;
  total_time: number;
};

type TotalTimeInfo = {
  total_time: number;
  time_list: TimeInfo[];
};

type ValidTotalTimeInfo = {
  valid_total_time: number;
  time_list: TimeInfo[];
};

type PersonalData = {
  stu_id: string;
  chi_name: string;
  eng_name: string;
  clubs_info: ClubInfo[];
  total_time_info: TotalTimeInfo;
  valid_total_time_info: ValidTotalTimeInfo;
};

// 新增一个辅助函数来格式化时间
/**
 * Formats minutes into a human-readable string
 * @param {number} minutes - Total minutes to format
 * @returns {string} Formatted time string (e.g., "2 hours and 30 minutes")
 */
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) {
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  }
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

// 在文件顶部添加版本号常量
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "undefined";

// 在类型定义部分之后添加年份选择相关类型
type YearOption = {
  value: string;
  label: string;
};

/**
 * PersonalDataPage Component
 * 
 * Main dashboard component for displaying user's personal data and club participation.
 * Features:
 * - Collapsible navigation sidebar
 * - Personal information display
 * - Password management
 * - Club participation overview
 * - Time statistics visualization
 * 
 * @returns {JSX.Element} Rendered personal data dashboard
 */
export default function PersonalDataPage() {
  const [isNavExpanded, setIsNavExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('isNavExpanded');
      return savedState !== null ? JSON.parse(savedState) : true;
    }
    return true;
  });
  const [data, setData] = useState<PersonalData | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)
  const [userRole, setUserRole] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const yearOptions: YearOption[] = [
    { value: "all", label: "All Years" },
    { value: "2023-2024", label: "2023-2024" },
    { value: "2024-2025", label: "2024-2025" },
    { value: "2025-2026", label: "2025-2026" },
  ];


  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = await getAuth();
      setUserRole(session?.user?.role_id || null);
      
      let response;
      if (selectedYear === "all") {
        response = await api.student.getPersonalData(session?.user?.api_token || "");
      } else {
        response = await api.student.getPersonalDataByYear(session?.user?.api_token || "", selectedYear);
      }
      console.log(response.msg);
      if (response.code === "0") {
        setData(response.data);
      } else {
        // setError(response.msg)
      }
    } catch (error) {
      // setError("Failed to fetch data")
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear]); // 将 selectedYear 作为依赖项
  
  useEffect(() => {
    fetchData();
  }, [fetchData]); // 只依赖 fetchData

  const toggleNav = () => {
    setIsNavExpanded((prev: boolean) => {
      const newState = !prev;
      // 保存状态到localStorage
      localStorage.setItem('isNavExpanded', JSON.stringify(newState));
      return newState;
    });
  }

  const getParticipationColor = (bgColor: ClubInfo['bg_color']) => {
    if (bgColor === 'green') return 'bg-green-500'
    if (bgColor === 'yellow') return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const handleChangePassword = async () => {
    try {
      const session = await getAuth();
      const response = await api.student.modifyPassword(session?.user?.api_token || "", newPassword)
      if (response.code === "0") {
        toast({
          title: "Password changed successfully",
          description: "Your password has been updated.",
        })
        setIsChangePasswordOpen(false)
        setNewPassword("")
      } else {
        toast({
          title: "Error",
          description: response.msg,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    try {
      const session = await getAuth();
      await logout(session?.user.api_token || "")
    } catch (error) {
      console.error(error)
    }
  }

  const handleQuitClub = async (clubMemberId: string) => {
    try {
      const session = await getAuth();
      const response = await api.clubMember.quit(session?.user?.api_token || "", clubMemberId)
      if (response.code === "0") {
        toast({
          title: "Club left successfully",
          description: "You have successfully left the club.",
        })
        // 重新获取数据以更新页面
        fetchData()
      } else {
        toast({
          title: "Error",
          description: response.msg,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave the club",
        variant: "destructive",
      })
    }
  }

  const handleGoToTeachersPage = () => {
    window.location.href = "/dashboard/adminTeacher/managebyClubs";
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <nav className={`bg-white shadow-md transition-all duration-300 ease-in-out ${isNavExpanded ? 'w-64' : 'w-16'} flex flex-col fixed h-full z-10`}>
        <div className="p-4 flex justify-between items-center">
          {isNavExpanded && <span className="text-xl font-bold text-[#0f652c] flex-shrink-0">PH Clubs</span>}
          <button onClick={toggleNav} className="text-gray-500 hover:text-[#0f652c]">
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
            className="flex items-center p-4 hover:bg-gray-100 font-semibold bg-gray-100"
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

      <main className={`flex-1 p-6 ${isNavExpanded ? 'ml-64' : 'ml-16'} transition-all duration-300 ease-in-out overflow-y-auto`}>
        <div className="space-y-8 pb-8">
          <h1 className="text-4xl font-bold text-gray-800">Personal Data</h1>

          {isClient && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <InfoItem label="Student ID" value={data?.stu_id} />
                  <InfoItem label="Chinese Name" value={data?.chi_name} />
                  <InfoItem label="English Name" value={data?.eng_name} />
                  <div className="mt-4 space-x-4">
                    <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Lock className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <Input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                          <Button onClick={handleChangePassword}>Change Password</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                    {userRole === 3 && (
                      <Button variant="outline" onClick={handleGoToTeachersPage}>
                        Go to Teacher&apos;s Page
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 添加年份选择下拉菜单 */}
              <div className="flex justify-end mb-4 items-center">
                <Select value={selectedYear} onValueChange={setSelectedYear} disabled={isLoading}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isLoading && (
                  <div className="ml-2">
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-[#0f652c] animate-spin"></div>
                  </div>
                )}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Club Participation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Club Name</TableHead>
                          <TableHead>Participation</TableHead>
                          <TableHead>Total Time</TableHead>
                          <TableHead>Valid</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.clubs_info ? (
                          data.clubs_info.map((club) => (
                            <TableRow key={club.club_id}>
                              <TableCell className="whitespace-nowrap">{club.club_name}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <div className={`w-3 h-3 rounded-full ${getParticipationColor(club.bg_color)}`}></div>
                                  <span>{club.participation}</span>
                                </div>
                              </TableCell>
                              <TableCell>{formatTime(club.total_time)}</TableCell>
                              <TableCell>{club.valid ? 'Yes' : 'No'}</TableCell>
                              <TableCell>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                      Leave
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirm leaving club</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to leave {club.club_name}? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleQuitClub(club.club_member_id)}>
                                        Confirm
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5}>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data?.total_time_info ? (
                      <>
                        <p className="text-2xl font-bold mb-4">{formatTime(data.total_time_info.total_time)}</p>
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                          {data.total_time_info.time_list.map((item, index) => (
                            <div key={index} className="mb-2">
                              <p className="text-sm font-medium">{item.club_name}</p>
                              <Progress value={(item.total_time / data.total_time_info.total_time) * 100} className="h-2" />
                              <p className="text-xs text-right">{formatTime(item.total_time)}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Skeleton className="h-[200px] w-full" />
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Valid Total Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data?.valid_total_time_info ? (
                      <>
                        <p className="text-2xl font-bold mb-4">{formatTime(data.valid_total_time_info.valid_total_time)}</p>
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                          {data.valid_total_time_info.time_list.map((item, index) => (
                            <div key={index} className="mb-2">
                              <p className="text-sm font-medium">{item.club_name}</p>
                              <Progress value={(item.total_time / (data.valid_total_time_info.valid_total_time || 1)) * 100} className="h-2" />
                              <p className="text-xs text-right">{formatTime(item.total_time)}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Skeleton className="h-[200px] w-full" />
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

/**
 * InfoItem Component
 * 
 * Renders a labeled information item with loading skeleton support
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the information item
 * @param {string} [props.value] - Value to display (optional)
 * @returns {JSX.Element} Rendered information item
 */
function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="mb-2">
      <strong>{label}:</strong>{' '}
      {value ? (
        <span>{value}</span>
      ) : (
        <Skeleton className="h-4 w-[200px] inline-block" />
      )}
    </div>
  )
}
