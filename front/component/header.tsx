import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function Header({isLogin}: {isLogin: boolean}) {
    var account_button;
    if (isLogin) {
        account_button = (
            <Button onClick={onLogin} color="inherit">
                Login
            </Button>
        );
    } else {
        account_button = (
            <Button onClick={onLogout} color="inherit">
                Logout
            </Button>
        );
    }
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        DHU portal to Google Cal.
                    </Typography>
                    <Button onClick={isLogin ? onLogin : onLogout} color="inherit">
                        {isLogin ? "login" : "logout"}
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );

    function onLogin() {
        console.log("login");
    }

    function onLogout() {
        console.log("logout");
    }
}
