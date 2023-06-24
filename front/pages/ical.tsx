import { Container, Link } from "@mui/material";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HEAD from "../components/Head";
import { ImportIcalForm } from "../components/ImportIcalForm";

export default function Home() {
    const { t } = useTranslation("pages");
    return (
        <>
            <HEAD />
            <Container sx={{ pt: 2 }} maxWidth='sm'>
                <ImportIcalForm />
            </Container>
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale!, ["common", "components", "pages"])),
    },
});
