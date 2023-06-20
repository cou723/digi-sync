import { AppBar, Button, Container, Box, Toolbar } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import FloatMenu from './FloatMenu'
import LoginBtn from './HeaderModules/LoginBtn'
import Logo from './HeaderModules/Logo'

const pages = [
    { display: 'Google Calendarへ', link: '/' },
    { display: 'そのほかのカレンダーへ', link: '/ical' },
    { display: 'Q&A', link: '/q_and_a' },
]

export default function Header() {
    const [width, setWidth] = useState(null)
    const updateWidth = () => {
        setWidth(window.innerWidth)
    }
    useEffect(() => {
        window.addEventListener(`resize`, updateWidth, {
            capture: false,
            passive: true,
        })

        return () => window.removeEventListener(`resize`, updateWidth)
    })

    const router = useRouter()
    return (
        <AppBar position='static'>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Logo />

                    {!(width == null || width > 740) ? (
                        <FloatMenu pages={pages} />
                    ) : (
                        <Box sx={{ flexGrow: 1, display: { md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button
                                    variant='text'
                                    key={page.display}
                                    onClick={() => router.push(page.link)}
                                    sx={{ my: 1, color: 'white', textTransform: 'none' }}
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
    )
}
