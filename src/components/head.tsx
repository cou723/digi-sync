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
			<meta content={description} name='description' />
			<meta content='summary_large_image' name='twitter:card' />
			<meta content={title} property='og:title' />
			<meta content={description} property='og:description' />
			<meta content={url} property='og:url' />
			<meta content={title} property='og:site_name' />
			<meta content={type} property='og:type' />
			<meta content={imageUrl} property='og:image' />
		</Head>
	);
};
export default CommonMeta;
