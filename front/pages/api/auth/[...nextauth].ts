import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
console.log(process.env.NEXT_PUBLIC_GOOGLE_ID || '', process.env.NEXT_PUBLIC_GOOGLE_SECRET)
export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_ID || '',
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET || '',
            authorization: { params: { scope: 'openid https://www.googleapis.com/auth/calendar' } },
            httpOptions: {
                timeout: 60000,
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account && account.access_token) token.accessToken = account.access_token
            return token
        },
        async session({ session, token, user }) {
            session.accessToken = token.accessToken
            session.user.email = session.user.email
            return session
        },
    },
    secret: 'T7sGkMv0CZQYDHhoQ9Lel1WebWMXIvjctqHi+wBcHko=',
    debug: true,
}

export default NextAuth(authOptions)
