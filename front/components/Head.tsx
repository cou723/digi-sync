import Head from "next/head";
import { useTranslation } from "next-i18next";

const CommonMeta = () => {
    const { t: ct } = useTranslation("common");
    const { t } = useTranslation("components");
    const title = ct("digi_sync");
    const description = t("Head.description");
    const url = "https://dp2gc.vercel.app";
    const type = "website";
    const imageUrl = "https://dp2gc.vercel.app/ogp_image.png";

    return (
        <Head>
            <title> {title}</title>
            <meta name='description' content={description} />
            <meta name='twitter:card' content='summary_large_image' />
            <meta property='og:title' content={title} />
            <meta property='og:description' content={description} />
            <meta property='og:url' content={url} />
            <meta property='og:site_name' content={title} />
            <meta property='og:type' content={type} />
            <meta property='og:image' content={imageUrl} />
        </Head>
    );
};
export default CommonMeta;
