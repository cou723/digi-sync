import { Session } from "next-auth";
import { useSession } from "next-auth/react";

// TODO: ここもうちょっと厳密な型を使いたい。というよりnext-authにもうちょっとちゃんと型安全にする方法がある気がする
export function useCustomSession(): {
	authStatus: "unauthenticated" | "authenticated" | "loading";
	session: Session;
} {
	const { data, status: authStatus } = useSession();
	// useSessionの型が自分で定義したSession型と異なるため、キャストする

	const session = data as unknown as Session;
	return { authStatus, session };
}
