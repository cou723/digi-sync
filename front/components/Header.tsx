import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import LoginBtn from "./LoginBtn";

export default function Header({setIsGoogleLogin}: {setIsGoogleLogin: (isGoogleLogin: boolean) => void}) {
    var account_button;
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        DHU portal to Google Cal.
                    </Typography>
                    <LoginBtn setIsGoogleLogin={setIsGoogleLogin}></LoginBtn>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
