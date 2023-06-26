import { Alert, Container, Link } from "@mui/material";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HEAD from "../components/Head";
import ImportForm from "../components/ImportForm";

export default function Home() {
    const { t } = useTranslation("pages");
    const { t: ct } = useTranslation("common");
    const { status: authStatus } = useSession();
    return (
        <>
            <HEAD />
            <Container sx={{ pt: 2 }} maxWidth='sm'>
                {authStatus == "unauthenticated" && (
                    <Alert sx={{ mt: 2 }} severity='error'>
                        {t("index.error")}
                        <Link href='/ical'>{t("index.here")}</Link>
                    </Alert>
                )}
                <Alert sx={{ mt: 2 }} severity='info'>
                    このプロジェクトでは現在翻訳者を募集中です。
                    もし留学生の方で母国語に翻訳してくださる方がいたら
                    <Link href='https://twitter.com/coffeec91065940'>開発者のTwitter</Link>
                    までご連絡ください。
                </Alert>

                <ImportForm />
            </Container>
        </>
    );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale!, ["common", "components", "pages"])),
    },
});
