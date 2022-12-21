import {SessionProvider} from "next-auth/react";
import { CssBaseline } from '@mui/material'
import type {AppProps} from "next/app";

export default function App({Component, pageProps: {session, ...pageProps}}: AppProps) {
    return (
        <SessionProvider session={session}>
            <CssBaseline />
            <Component {...pageProps} />
        </SessionProvider>
    );
}
