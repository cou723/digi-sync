import {AppBar, Box, Toolbar, Button, Container} from "@mui/material";
import LoginBtn from "./LoginBtn";
import {useRouter} from "next/router";
import Image from "next/image";
import LogoImage from "../public/logo.svg";

const pages = [
    {display: "インポート", link: "/"},
    {display: "About", link: "/about"},
    {display: "プライバシーポリシー", link: "/privacy_policy"},
    {display: "利用規約", link: "/terms_and_conditions"},
];

export default function Header() {
    const router = useRouter();
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{mt: 1, display: "block", mr: 2}}>
                        <Image src={LogoImage} alt="デジシンク" height="40" />
                    </Box>
                    <Box sx={{flexGrow: 1, display: {md: "flex"}}}>
                        {pages.map((page) => (
                            <Button key={page.display} onClick={() => router.push(page.link)} sx={{my: 1, color: "white"}}>
                                {page.display}
                            </Button>
                        ))}
                    </Box>
                    <LoginBtn />
                </Toolbar>
            </Container>
        </AppBar>
    );
}
