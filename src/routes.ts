export const publicRoutes = [
    "/",
    "/home",
    "/documentation",
    "/about",
    "/api/hello",
    "/api/serviceApis",
    "/api/betaAuth",
    "/blog/*",
    "/stories"
]

export const authRoutes = [
    "/login"
]

export const apiAuthPrefix = [
    "/api/auth"
]

export const presidentRoutes = [
    "/dashboard/clubManagement"
]

export const teacherRoutes = [
    "/dashboard/adminTeacher/managebyClubs",
    "/dashboard/adminTeacher/managebyStudents"
]

export const adminRoutes = [
    "/dashboard/addBlog"
]

export const DEFAULT_LOGIN_REDIRECT = "/dashboard/overview"
export const DEFAULT_LOGOUT_REDIRECT = "/login"