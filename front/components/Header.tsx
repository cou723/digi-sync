import { AppBar, Button, Container, Box, Toolbar } from '@mui/material'
import { useRouter } from 'next/router'
import LoginBtn from './HeaderModules/LoginBtn'
import Logo from './HeaderModules/Logo'

const pages = [
    { display: 'Google Calendarへ', link: '/' },
    { display: 'そのほかのカレンダーへ', link: '/ical' },
]

export default function Header() {
    const router = useRouter()
    return (
        <AppBar position='static'>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Logo />

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

                    <LoginBtn />
                </Toolbar>
            </Container>
        </AppBar>
    )
}
