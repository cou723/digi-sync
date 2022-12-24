import {useSession, signIn, signOut} from "next-auth/react";
import {Button} from "@mui/material";
import Fetch from "./import_module/ToCalendar";

export default function LoginBtn({setIsGoogleLogin}: {setIsGoogleLogin: (isGoogleLogin: boolean) => void}) {
    const {data: session} = useSession();
    const onSignIn = () => {
        setIsGoogleLogin(true);
        signIn("google");
    };
    const onSignOut = () => {
        setIsGoogleLogin(false);
        signOut();
    };
    if (session && session.user)
        setIsGoogleLogin(true);
    else
        setIsGoogleLogin(false);
    if (session && session.user) {
        return (
            <>
                <Button variant="contained" onClick={onSignOut}>Sign out</Button>
            </>
        );
    }
    return (
        <>
            <Button variant="contained" onClick={onSignIn}>Sign in</Button>
        </>
    );
}
