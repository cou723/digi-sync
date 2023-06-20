import LunchDiningIcon from '@mui/icons-material/LunchDining'
import { Drawer, List, ListItem, ListItemButton, Fab } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

type Props = {
    pages: { display: string; link: string }[]
}

const style = {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
}

export default React.memo(function FloatMenu({ pages }: Props) {
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const router = useRouter()
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

    return (
        <>
            <Fab
                sx={{ position: 'fixed' }}
                style={style}
                onClick={onClick}
                color='primary'
                aria-label='add'
            >
                <LunchDiningIcon />
            </Fab>
            <Drawer anchor='bottom' open={isOpenDrawer} onClose={toggleDrawer(false)}>
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
    )
}
)