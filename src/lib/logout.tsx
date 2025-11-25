"use server"
import { signOut } from "@/auth"
import { DEFAULT_LOGOUT_REDIRECT } from '@/routes'
import { AuthError } from "next-auth"
import api from "./clientApi"

export const logout = async (token:string) => {
    try {
        const response = await api.student.logout(token)
        if (response.code === "0") {
            await signOut( {
                redirectTo: DEFAULT_LOGOUT_REDIRECT
            }) 
        }
        
    } catch (error) {
        if (error instanceof AuthError) {
            // console.log(error.type)
            switch (error.type) {
                case "SignOutError":
                    return {error: "Error signing out"}
                default:
                    return {error: "Something went wrong."}
            }
        }
        throw error;
    }
}