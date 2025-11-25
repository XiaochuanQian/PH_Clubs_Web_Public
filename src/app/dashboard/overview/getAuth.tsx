"use server"
import { auth } from "@/auth"
 
export default async function getAuth() {
  const session = await auth()

  return (
    session
  )
}