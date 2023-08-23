import { Alert, Container, Link } from "@mui/material";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import HEAD from "../components/head";
import ImportForm from "../components/importForm";

export default function Home() {
	const { t } = useTranslation("pages");
	const { status: authStatus } = useCustomSession();
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
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		...(await serverSideTranslations(locale!, ["common", "components", "pages"])),
	},
});
