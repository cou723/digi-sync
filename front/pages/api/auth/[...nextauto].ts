import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_SECRET || "",
            authorization: { params: { scope: 'openid https://www.googleapis.com/auth/calendar' } }
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account && account.access_token) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token, user }) {
            session.accessToken = token.accessToken
            return session
        }
    }
}

export default NextAuth(authOptions)
