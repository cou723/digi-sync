import { AppBar, Button, Container, Box, Toolbar, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

import { FloatMenu } from "@/components/floatMenu";

// TODO: @lib使ってほしい
import theme from "../../libs/colorTheme";

import LoginBtn from "./loginBtn";
import Logo from "./logo";

export default React.memo(function Header() {
	// TODO: pages外だししたい
	const pages = [
		{ display: "Googleカレンダーへインポート", link: "/" },
		{ display: ".ical形式でダウンロード", link: "/ical" },
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
									key={page.display}
									onClick={() => router.push(page.link)}
									sx={{ color: "white", my: 1, textTransform: "none" }}
									variant='text'
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
