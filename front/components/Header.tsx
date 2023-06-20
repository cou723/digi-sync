import LunchDiningIcon from '@mui/icons-material/LunchDining'
import {
    AppBar,
    Button,
    Container,
    Box,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    Fab,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import LoginBtn from './HeaderModules/LoginBtn'
import Logo from './HeaderModules/Logo'

const style = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
}

const pages = [
    { display: 'Google Calendarへ', link: '/' },
    { display: 'そのほかのカレンダーへ', link: '/ical' },
    { display: 'Q&A', link: '/q_and_a' },
]

export default function Header() {
    const [width, setWidth] = useState(null)
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
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

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return
        }

        setIsOpenDrawer(open)
    }

    function onClick() {
        setIsOpenDrawer(!isOpenDrawer)
    }

    const router = useRouter()
    return (
        <AppBar position='static'>
            <Container maxWidth='xl'>
                <Toolbar disableGutters>
                    <Logo />

                    {width > 740 ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <Fab style={style} onClick={onClick} color='primary' aria-label='add'>
                                <LunchDiningIcon />
                            </Fab>
                            <Drawer
                                anchor='bottom'
                                open={isOpenDrawer}
                                onClose={toggleDrawer(false)}
                            >
                                <List>
                                    {pages.map((page) => (
                                        <ListItem key={page.display} disablePadding>
                                            <ListItemButton
                                                key={page.display}
                                                onClick={() => router.push(page.link)}
                                                sx={{
                                                    my: 1,
                                                }}
                                            >
                                                {page.display}
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Drawer>
                        </>
                    )}
                    <LoginBtn />
                </Toolbar>
            </Container>
        </AppBar>
    )
}
