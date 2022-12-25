import {SessionProvider} from "next-auth/react";
import { CssBaseline } from '@mui/material'
import type {AppProps} from "next/app";
import Header from "../components/Header";

export default function App({Component, pageProps: {session, ...pageProps}}: AppProps) {
    return (
        <SessionProvider session={session}>
            <CssBaseline />
            <Header></Header>
            <Component {...pageProps} />
        </SessionProvider>
    );
}
