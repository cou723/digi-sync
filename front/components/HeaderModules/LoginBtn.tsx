import { Button, ButtonProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { signIn, signOut, useSession } from 'next-auth/react'

const ColorButton = styled(Button)<ButtonProps>(() => ({
    textTransform: 'none',
    color: '#fff',
    border: '1px solid',
    borderColor: '#fff',
    '&:hover': {
        color: '#ff5a00',
        backgroundColor: '#fff',
    },
}))

export default function LoginBtn() {
    const { status } = useSession()
    if (status == 'authenticated') {
        return (
            <ColorButton sx={{ my: 1 }} color='inherit' onClick={() => signOut()} size='large'>
                Sign out
            </ColorButton>
        )
    }
    return (
        <ColorButton sx={{ my: 1 }} color='inherit' onClick={() => signIn('google')} size='large'>
            Sign in with Google
        </ColorButton>
    )
}
