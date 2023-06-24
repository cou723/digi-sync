import { Html, Head, Main, NextScript } from "next/document";
import { useTranslation } from "next-i18next";

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
