import { Container, Link } from "@mui/material";
import { useTranslation } from "next-i18next";
import HEAD from "../components/Head";
import { ImportIcalForm } from "../components/ImportIcalForm";

export default function Home() {
    const { t } = useTranslation();
    return (
        <>
            <HEAD />
            <Container sx={{ pt: 2 }} maxWidth='sm'>
                <Link href='/'>{t("pages.ical.link")}</Link>
                <ImportIcalForm />
            </Container>
        </>
    );
}
