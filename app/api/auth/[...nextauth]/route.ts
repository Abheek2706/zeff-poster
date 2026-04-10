import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { findOrCreateGoogleUser } from "@/lib/userDb"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Find or auto-create account for new users based on Google profile
        findOrCreateGoogleUser({
            id: profile?.sub || user.id, // Using google's sub id or the generated ID
            email: user.email as string,
            name: user.name as string,
            image: user.image as string,
        })
        return true
      }
      return false // Decline any other providers
    },
    async session({ session, token }) {
      // Map token to session
      if (session.user) {
        // Use sub (google id) from token to augment session user object if needed.
        (session.user as any).id = token.sub
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days secure cookie
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
