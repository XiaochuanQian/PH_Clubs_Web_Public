"use server"
import { signIn } from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { redirect } from "next/navigation"
import { AuthError } from "next-auth"

export const login = async (stu_id:string, password:string) => {
    try {
        const loginResult = await signIn("credentials",{
            stu_id,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
        // console.log(loginResult)
        // if (loginResult?.user?.role_id === 1 || loginResult?.user?.role_id === 2) {
        //     // redirect to dashboard
        //     redirect(DEFAULT_LOGIN_REDIRECT)
        // } else if (loginResult?.user?.role_id === 3) {
        //     // redirect to blog
        //     redirect('/dashboard/manageStudents')
        // }
    } catch (error) {
        if (error instanceof AuthError) {
            // console.log(error.type)
            switch (error.type) {
                case "CredentialsSignin":
                    return {error: "Student Id or password incorrect."}
                default:
                    return {error: "Something went wrong."}
            }
        }
        throw error;
    }
}