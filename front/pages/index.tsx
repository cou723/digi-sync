import { Alert, Container, Link } from "@mui/material";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HEAD from "../components/Head";
import ImportForm from "../components/ImportForm";

export default function Home() {
    const { t } = useTranslation("pages");
    const { status: authStatus } = useSession();
    return (
        <>
            <HEAD />
            <Container sx={{ pt: 2 }} maxWidth='sm'>
                {authStatus == "unauthenticated" && (
                    <Alert severity='error'>
                        {t("index.error")}
                        <Link href='/ical'>{t("index.here")}</Link>
                    </Alert>
                )}
                <ImportForm />
            </Container>
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale!, ["common","components","pages"])),
    },
});
