import { Alert, Container, Link } from "@mui/material";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HEAD from "../components/Head";
import ImportForm from "../components/ImportForm";

export default function Home() {
    const { t } = useTranslation("common");
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

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale!, ["common"])),
    },
});
