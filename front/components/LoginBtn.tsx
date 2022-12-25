import {useSession, signIn, signOut} from "next-auth/react";
import {Button} from "@mui/material";

export default function LoginBtn() {
    const {data: session, status} = useSession();
    if (status == "authenticated") {
        return (
            <Button variant="contained" onClick={() => signOut()}>
                Sign out
            </Button>
        );
    }
    return (
        <Button variant="contained" onClick={() => signIn("google")}>
            Sign in
        </Button>
    );
}
