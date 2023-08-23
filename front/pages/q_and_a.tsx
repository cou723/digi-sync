import { Typography, Container } from "@mui/material";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Question from "../components/qAndA";

export default function QAndA() {
	const { t } = useTranslation("pages");
	return (
		<Container sx={{ py: 2 }} maxWidth='sm'>
			<Typography variant='h4' component='h1' gutterBottom>
				Q&A
			</Typography>
			<Question
				question={t("q_and_a.what_this.question")}
				answer={t("q_and_a.what_this.answer")}
			/>
			<Question
				question={t("q_and_a.no_auto_remove.question")}
				answer={t("q_and_a.no_auto_remove.answer")}
			/>
			<Question
				question={t("q_and_a.sync_keep_doing.question")}
				answer={t("q_and_a.sync_keep_doing.answer")}
			/>
			<Question
				question={t("q_and_a.wrong_calendar.question")}
				answer={t("q_and_a.wrong_calendar.answer")}
			/>
			<Question
				question={t("q_and_a.dont_show_calendar.question")}
				answer={t("q_and_a.dont_show_calendar.answer")}
			/>
		</Container>
	);
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		...(await serverSideTranslations(locale!, ["common", "components", "pages"])),
	},
});
