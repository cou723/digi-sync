import { AppBar, Button, Container, Box, Toolbar, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React from "react";
import FloatMenu from "./FloatMenu";
import LoginBtn from "./HeaderModules/LoginBtn";
import Logo from "./HeaderModules/Logo";
import theme from "libs/colorTheme";

export default React.memo(function Header() {
    const { t } = useTranslation("common");

    const pages = [
        { display: "Google Calendarへ", link: "/" },
        { display: "そのほかのカレンダーへ", link: "/ical" },
        { display: "Q&A", link: "/q_and_a" },
    ];
    const matches = useMediaQuery(theme.breakpoints.up("sm"));

    const router = useRouter();
    return (
        <AppBar position='static'>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Logo />
                    {t("test")}
                    {!matches ? (
                        <FloatMenu pages={pages} />
                    ) : (
                        <Box sx={{ flexGrow: 1, display: { md: "flex" } }}>
                            {pages.map((page) => (
                                <Button
                                    variant='text'
                                    key={page.display}
                                    onClick={() => router.push(page.link)}
                                    sx={{ my: 1, color: "white", textTransform: "none" }}
                                >
                                    {page.display}
                                </Button>
                            ))}
                        </Box>
                    )}
                    <LoginBtn />
                </Toolbar>
            </Container>
        </AppBar>
    );
});
