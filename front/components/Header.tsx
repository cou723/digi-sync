import {AppBar, Box, Toolbar, Typography, Button} from "@mui/material";
import LoginBtn from "./LoginBtn";
import {useRouter} from "next/router";

const pages = [
    {display: "インポート", link: "/"},
    {display: "About", link: "/about"},
    {display: "プライバシーポリシー", link: "/privacy_policy"},
    {display: "利用規約", link: "/terms_and_conditions"},
];

export default function Header() {
    const router = useRouter();
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        DHU portal to Google Cal.
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: "none", md: "flex"}}}>
                        {pages.map((page) => (
                            <Button key={page.display} onClick={() => router.push(page.link)} sx={{my: 2, color: "white", display: "block"}}>
                                {page.display}
                            </Button>
                        ))}
                    </Box>
                    <LoginBtn />
                </Toolbar>
            </AppBar>
        </Box>
    );
}
