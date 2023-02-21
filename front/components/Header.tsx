import {AppBar, /* Box, */ Toolbar, /* Button, */ Container} from "@mui/material";
import LoginBtn from "./HeaderModules/LoginBtn";
import Logo from "./HeaderModules/Logo";
// import {useRouter} from "next/router";

const pages = [
    {display: "インポート", link: "/"},
    {display: "About", link: "/about"},
    {display: "プライバシーポリシー", link: "/privacy_policy"},
    {display: "利用規約", link: "/terms_and_conditions"},
];

export default function Header() {
    // const router = useRouter();
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Logo />
                    {/*
                        <Box sx={{flexGrow: 1, display: {md: "flex"}}}>
                            {pages.map((page) => (
                                <Button variant="text" key={page.display} onClick={() => router.push(page.link)} sx={{my: 1, color: "white"}}>
                                    {page.display}
                                </Button>
                            ))}
                        </Box>
                    */}
                    <LoginBtn />
                </Toolbar>
            </Container>
        </AppBar>
    );
}
