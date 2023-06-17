import { Alert, Container, Link } from '@mui/material'
import { useSession } from 'next-auth/react'
import HEAD from '../components/Head'
import ImportForm from '../components/ImportForm'

export default function Home() {
    const { status: authStatus } = useSession()
    return (
        <>
            <HEAD />
            <Container sx={{ pt: 2 }} maxWidth='sm'>
                <Link href='/ical'>Googleカレンダー以外にインポートする場合はこちら</Link>
                {authStatus == 'unauthenticated' && (
                    <Alert severity='error'>
                        GoogleアカウントでログインしないとGoogleカレンダーにインポートする昨日は使えません。icalでダウンロードしたい方は
                        <Link href='/ical'>こちら</Link>
                    </Alert>
                )}
                <ImportForm />
            </Container>
        </>
    )
}
