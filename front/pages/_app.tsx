import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Header from '../components/Header'
import theme from '../libs/colorTheme'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <SessionProvider session={session}>
                <CssBaseline />
                <Header />
                <Component {...pageProps} />
            </SessionProvider>
            <Analytics />
        </ThemeProvider>
    )
}
