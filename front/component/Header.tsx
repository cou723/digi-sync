import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function Header() {
    var account_button;
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        DHU portal to Google Cal.
                    </Typography>
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
