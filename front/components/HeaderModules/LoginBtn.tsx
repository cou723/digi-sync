import {useSession, signIn, signOut} from "next-auth/react";
import {Button, ButtonProps} from "@mui/material";
import {styled} from "@mui/material/styles";

const ColorButton = styled(Button)<ButtonProps>(({theme}) => ({
    textTransform: "none",
    color: "#fff",
    border: "1px solid",
    borderColor: "#fff",
    "&:hover": {
        color: "#ff5a00",
        backgroundColor: "#fff",
    },
}));

export default function LoginBtn() {
    const {data: session, status} = useSession();
    if (status == "authenticated") {
        return (
            <ColorButton sx={{my:1}} color="inherit" onClick={() => signOut()} size="large">
                Sign out
            </ColorButton>
        );
    }
    return (
        <ColorButton sx={{my:1}} color="inherit" onClick={() => signIn("google")} size="large">
            Sign in with Google
        </ColorButton>
    );
}
