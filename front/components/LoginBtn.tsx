import {useSession, signIn, signOut} from "next-auth/react";
import {Button} from "@mui/material";

export default function LoginBtn() {
    const {data: session, status} = useSession();
    if (status == "authenticated") {
        return (
            <Button color="inherit" onClick={() => signOut()}>
                Sign out
            </Button>
        );
    }
    return (
        <Button color="inherit" onClick={() => signIn("google")}>
            Sign in
        </Button>
    );
}
