import { AppBar, Button, Container, Box, Toolbar, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React from "react";

import theme from "libs/colorTheme";


import FloatMenu from "./floatMenu";
import LoginBtn from "./headerModules/loginBtn";
import Logo from "./headerModules/logo";

export default React.memo(function Header() {
	const { t } = useTranslation("components");

	const pages = [
		{ display: t("Header.to_google_calendar"), link: "/" },
		{ display: t("Header.to_ical"), link: "/ical" },
		{ display: "FAQ", link: "/q_and_a" },
	];
	const matches = useMediaQuery(theme.breakpoints.up("sm"));

	const router = useRouter();
	return (
		<AppBar position='static'>
			<Container maxWidth='xl'>
				<Toolbar disableGutters>
					<Logo />
					{!matches ? (
						<FloatMenu pages={pages} />
					) : (
						<Box sx={{ display: { md: "flex" }, flexGrow: 1 }}>
							{pages.map((page) => (
								<Button
									variant='text'
									key={page.display}
									onClick={() => router.push(page.link)}
									sx={{ color: "white", my: 1, textTransform: "none" }}
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
