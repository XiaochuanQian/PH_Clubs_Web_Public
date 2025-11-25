import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // {"user":{"api_token":"XtWCxvyC2bzweK4L5rqaG5VJ01FcgA4__1710458867","stu_id":"2320610","grade":"11.6","chi_name":"钱小川","eng_name":"Michael","role_id":2,"role_name":"president","last_login_time":"2024-10-24 23:47:00","id":"345c0ae8-3b8d-40a8-ba67-5b777a06ce51"},
    // "expires":"2024-11-26T02:45:34.204Z"}
    user: {
      /** The user's postal address. */
      api_token: string,
      stu_id: string,
      grade: string,
      chi_name: string,
      eng_name: string,
      role_id: number,
      role_name: string,
      last_login_time: string,
      id: string,
    }
  }
  interface User {
    api_token: string,
    stu_id: string,
    grade: string,
    chi_name: string,
    eng_name: string,
    role_id: number,
    role_name: string,
    last_login_time: string,
  }

  /* api_token: response.data.api_token,
    stu_id: response.data.stu_id,
    grade: response.data.grade,
    chi_name: response.data.chi_name,
    eng_name: response.data.eng_name,
    role_id: response.data.role_id,
    role_name: response.data.role_name,
    last_login_time: response.data.last_login_time,
      */
}
