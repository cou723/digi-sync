import {useSession, signIn, signOut} from "next-auth/react";
import Fetch from "./ToCalendar";

export default function LoginBtn() {
    const {data: session} = useSession();
    if (session && session.user) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        );
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn('google')}>Sign in</button>
        </>
    );
}
