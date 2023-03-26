import ImportForm from "../components/ImportForm";
import {Container, Alert, Fade, Link} from "@mui/material";
import HEAD from "../components/Head";
import {useSession} from "next-auth/react";

export default function Home() {
    const {data: session, status: authStatus} = useSession();
    return (
        <>
            <HEAD />
            <Container sx={{pt: 2}} maxWidth="sm">
                <Link href="/ical">Googleカレンダー以外にインポートする場合はこちら</Link>
                {authStatus == "unauthenticated" && <Alert severity="error">Googleアカウントでログインしないとデジシンクは使えません</Alert>}
                <ImportForm />
            </Container>
        </>
    );
}
