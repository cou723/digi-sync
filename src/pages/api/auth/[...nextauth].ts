import NextAuth, { Session, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_SECRET || "";

if (GOOGLE_CLIENT_ID == "" || GOOGLE_CLIENT_SECRET == "") {
	throw new Error(
		"Google OAuth2.0のクライアントID(NEXT_PUBLIC_GOOGLE_ID)またはクライアントシークレット(NEXT_PUBLIC_GOOGLE_SECRET)が設定されていません",
	);
}

export const authOptions: NextAuthOptions = {
	callbacks: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async jwt({ token, account }: { account: any; token: JWT }) {
			if (account && account.access_token) token.accessToken = account.access_token;
			return token;
		},
		async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
			session.accessToken = token.accessToken;
			return session;
		},
	},
	debug: true,
	providers: [
		GoogleProvider({
			authorization: { params: { scope: "openid https://www.googleapis.com/auth/calendar" } },
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			httpOptions: {
				timeout: 6000,
			},
		}),
	],
	secret: GOOGLE_CLIENT_SECRET,
	pages:{
		signIn:"/"
	}
};

export default NextAuth(authOptions);
