

declare module "next-auth" {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		accessToken: string;
		user: {
			email: string;
		};
	}
}

declare module "next-auth/jwt" {
	/** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
	interface JWT {
		accessToken: string;
		/** OpenID ID Token */
		idToken?: string;
	}
}
