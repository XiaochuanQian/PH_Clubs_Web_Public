import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import api from '@/lib/clientApi';

// Configure NextAuth authentication with credentials provider
export const { handlers, signIn, signOut, auth } = NextAuth({
  // Secret key for JWT encryption and session management
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      // Define required credentials for login
      credentials: {
        stu_id: {}, // Student ID field
        password: {}, // Password field
      },
      // Authorization logic for validating credentials
      authorize: async (credentials) => {
        // Check if required credentials are provided
        if (!credentials?.stu_id || !credentials?.password) {
          return null;
        }

        try {
          // Attempt to authenticate user with provided credentials
          let response = await api.student.login(credentials.stu_id.toString(), credentials.password.toString());
          // login credential to add blog
          if (credentials.stu_id === '///////' && credentials.password === '*******') {
            return {
              api_token: 'admin',
              stu_id: 999999999,
              grade: 'admin',
              chi_name: 'admin',
              eng_name: 'admin',
              role_id: 99,
              role_name: 'admin',
              last_login_time: new Date().toISOString(),
            };
          }
          if (response.code === 0) {
            // Authentication successful - return user data
            return {
              api_token: response.data.api_token,
              stu_id: response.data.stu_id,
              grade: response.data.grade,
              chi_name: response.data.chi_name,
              eng_name: response.data.eng_name,
              role_id: response.data.role_id,
              role_name: response.data.role_name,
              last_login_time: response.data.last_login_time,
            };
          } else if (response.code === '1001') {
            // Invalid credentials
            return null;
          } else {
            // Other authentication errors
            return null;
          }
        } catch (error) {
          // Handle any unexpected errors during authentication
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Called when user attempts to sign in
    async signIn({ user }) {
      if (user && user.api_token) {
        // Handle API token storage if needed
      }
      return true;
    },
    // Handles JWT token creation and updates
    async jwt({ token, user }) {
      if (user) {
        // Add user data to JWT token
        token.user = {
          api_token: user.api_token,
          stu_id: user.stu_id,
          grade: user.grade,
          chi_name: user.chi_name,
          eng_name: user.eng_name,
          role_id: user.role_id,
          role_name: user.role_name,
          last_login_time: user.last_login_time,
          id: user.id, 
        };
      }
      return token;
    },
    // Handles session data management
    async session({ session, token }) {
      if (token.user) {
        // Add user data from token to session
        session.user = token.user as any;
      }
      return session;
    }
  },
  // Custom authentication pages configuration
  pages: {
    signIn: '/login'
  },
  // Enable trust for host header
  trustHost: true,
})
