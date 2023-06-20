import { Alert, Container, Link } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import HEAD from "../components/Head";
import ImportForm from "../components/ImportForm";

export default function Home() {
    const { t } = useTranslation();
    const { status: authStatus } = useSession();
    return (
        <>
            <HEAD />
            <Container sx={{ pt: 2 }} maxWidth='sm'>
                <Link href='/ical'>{t("pages.index.link")}</Link>
                {authStatus == "unauthenticated" && (
                    <Alert severity='error'>
                        {t("pages.index.error")}
                        <Link href='/ical'>{t("pages.index.here")}</Link>
                    </Alert>
                )}
                <ImportForm />
            </Container>
        </>
    );
}
