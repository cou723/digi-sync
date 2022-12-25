import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import LoginBtn from "./LoginBtn";

export default function Header() {
    var account_button;
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        DHU portal to Google Cal.
                    </Typography>
                    <LoginBtn />
                </Toolbar>
            </AppBar>
        </Box>
    );
}
