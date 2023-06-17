import { Container, Link } from '@mui/material'
import HEAD from '../components/Head'
import { ImportIcalForm } from '../components/ImportIcalForm'

export default function Home() {
    return (
        <>
            <HEAD />
            <Container sx={{ pt: 2 }} maxWidth='sm'>
                <Link href='/'>Googleカレンダーにインポートする場合はこちら</Link>
                <ImportIcalForm />
            </Container>
        </>
    )
}
