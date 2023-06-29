import { Container } from "@mui/material";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HEAD from "../components/Head";
import { ImportIcalForm } from "../components/ImportIcalForm";

export default function Home() {
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
