import {SessionProvider} from "next-auth/react";
import {CssBaseline} from "@mui/material";
import type {AppProps} from "next/app";
import Header from "../components/Header";
import theme from "../color_theme";
import {ThemeProvider} from "@mui/material/styles";

export default function App({Component, pageProps: {session, ...pageProps}}: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <SessionProvider session={session}>
                <CssBaseline />
                <Header></Header>
                <Component {...pageProps} />
            </SessionProvider>
        </ThemeProvider>
    );
}
