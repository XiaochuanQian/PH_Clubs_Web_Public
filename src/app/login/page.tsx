"use client"
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import MarkdownRenderer from './MarkdownRenderer'

import { login } from '@/lib/login'

export default function LoginComponent() {
    const router = useRouter()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isAgreementOpen, setIsAgreementOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const stu_id = formData.get('stu_id') as string
        const password = formData.get('password') as string

        login(stu_id,password).then((data) => {
            if (data?.error){
                setError(data.error);
            } 
        });
        

    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-white md:bg-gray-100">
            <Card className="w-full max-w-sm border-none shadow-none md:shadow-lg">
                <CardHeader className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <Image
                            src="/ph_club_logo_full.png"
                            alt="PH Clubs Logo"
                            width={40}
                            height={40}
                        />
                        <CardTitle className="text-3xl font-bold md:text-2xl">PH Clubs Login</CardTitle>
                    </div>
                    <CardDescription>Enter your student ID and password to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="stu_id">Student ID</Label>
                                <Input id="stu_id" name="stu_id" type="text" placeholder="" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" name="password" type="password" required />
                            </div>
                            <div className="flex justify-between items-center">
                                <CardDescription>
                                    By logging in, you agree to our {" "}
                                    <Dialog open={isAgreementOpen} onOpenChange={setIsAgreementOpen}>
                                        <DialogTrigger asChild>
                                            <button className="text-[#0f652c] hover:underline font-bold">User Agreement</button>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[80vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>User Agreement</DialogTitle>
                                            </DialogHeader>
                                            <MarkdownRenderer />
                                        </DialogContent>
                                    </Dialog>
                                    .
                                </CardDescription>
                            </div>
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            <Button type="submit" className="w-full bg-[#0f652c] hover:bg-[#0f652c]/80 text-white font-bold text-lg md:text-base">
                                Login
                            </Button>
                        </div>
                    </form>
                    <button
                        onClick={() => setIsDialogOpen(true)}
                        className="text-sm text-[#0f652c] hover:underline w-full text-center mt-3"
                    >
                        Forgot Password?
                    </button>
                </CardContent>
            </Card>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Forgot Your Password?</AlertDialogTitle>
                        <AlertDialogDescription>
                            To reset your password, please contact:
                            <br />
                            <a href="mailto:xiaochuanqian23@shphschool.com" className="text-[#0f652c] hover:underline">
                                xiaochuanqian23@shphschool.com
                            </a>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
