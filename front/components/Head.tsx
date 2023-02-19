import Head from "next/head";

const title: string = "デジシンク";
const description: string = "「デジシンク」は、デジキャンからグーグルカレンダーに授業の予定を追加する簡単なツールです。ボタンひとつで正確な授業スケジュールをグーグルカレンダーに追加し、手動で入力する手間を省けます。時間管理がしやすくなるので、学生ライフに役立ててみてください。";
const url: string = "test";
const type: string = "website";
const imageUrl: string = "https://dp2gc.vercel.app/ogp_image.png";

const CommonMeta = () => {
    return (
        <Head>
            <title>デジログ</title>
            <meta name="description" content={description} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:site_name" content={title} />
            <meta property="og:type" content={type} />
            <meta property="og:image" content={imageUrl} />
        </Head>
    );
};
export default CommonMeta;
