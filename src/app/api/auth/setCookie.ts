import { cookies } from "next/headers";

// Function to set a cookie
export async function setLoginCookie(token: string) {
  const maxAge = 30 * 24 * 60 * 60; // 30 days in second
    // const maxAge = 10;
  cookies().set("authToken", token, {
    maxAge: maxAge,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function getLoginCookie() {
    return cookies().get("authToken")
}

export async function removeLoginCookie() {
    cookies().delete("authToken")
    return true;
}