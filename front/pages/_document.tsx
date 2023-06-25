import { GetStaticProps } from "next";
import { Html, Head, Main, NextScript } from "next/document";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Document() {
    const { t } = useTranslation("common");
    return (
        <Html lang='ja' prefix='og: http://ogp.me/ns#'>
            <title>{t("title")}</title>
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}


export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale!, ["common"])),
    },
});
