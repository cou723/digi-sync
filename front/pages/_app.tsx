import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Analytics } from "@vercel/analytics/react";
import { SessionProvider } from "next-auth/react";
import { appWithTranslation } from "next-i18next";

import Header from "../components/header";
import theme from "../libs/colorTheme";

import type { AppProps } from "next/app";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
	return (
		<ThemeProvider theme={theme}>
			<SessionProvider session={session}>
				<CssBaseline />
				<Header />
				<Component {...pageProps} />
			</SessionProvider>
			<Analytics />
		</ThemeProvider>
	);
};

export default appWithTranslation(App);
