import Head from "next/head";

const CommonMeta = () => {
	const title = "DigiSync";
	const url = "https://dp2gc.vercel.app";
	const type = "website";
	const imageUrl = "https://dp2gc.vercel.app/ogp_image.png";
	const description =
		"「DigiSync」は、デジキャンからグーグルカレンダーに授業の予定を追加する簡単なツールです。ボタンひとつで正確な授業スケジュールをグーグルカレンダーに追加し、手動で入力する手間を省けます。時間管理がしやすくなるので、学生ライフに役立ててみてください。";

	return (
		<Head>
			<title>{title}</title>
			<meta content={description} name='description' />
			<meta content='summary_large_image' name='twitter:card' />
			<meta content={title} property='og:title' />
			<meta content={description} property='og:description' />
			<meta content={url} property='og:url' />
			<meta content={title} property='og:site_name' />
			<meta content={type} property='og:type' />
			<meta content={imageUrl} property='og:image' />
			<meta content="YRVBxjKFSCa5gYxDgaLk0sjJFCDBkJ0z7IcFereoi1w" name="google-site-verification" />
		</Head>
	);
};
export default CommonMeta;
