import { Alert, Container, Link } from "@mui/material";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import HEAD from "@/components/head";
import ImportForm from "@/components/importForm";
import { useCustomSession } from "@/hooks/useCustomSession";

export default function Home() {
	const { t } = useTranslation("pages");
	const { authStatus } = useCustomSession();
	return (
		<>
			<HEAD />
			<Container maxWidth='sm' sx={{ pt: 2 }}>
				{authStatus == "unauthenticated" && (
					<Alert severity='error' sx={{ mt: 2 }}>
						{t("index.error")}
						<Link href='/ical'>{t("index.here")}</Link>
					</Alert>
				)}
				<Alert severity='info' sx={{ my: 2 }}>
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
