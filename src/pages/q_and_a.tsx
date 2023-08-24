import { Typography, Container } from "@mui/material";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Question from "@/components/qAndA";

export default function QAndA() {
	const { t } = useTranslation("pages");
	return (
		<Container maxWidth='sm' sx={{ py: 2 }}>
			<Typography component='h1' gutterBottom variant='h4'>
				Q&A
			</Typography>
			<Question
				answer={t("q_and_a.what_this.answer")}
				question={t("q_and_a.what_this.question")}
			/>
			<Question
				answer={t("q_and_a.no_auto_remove.answer")}
				question={t("q_and_a.no_auto_remove.question")}
			/>
			<Question
				answer={t("q_and_a.sync_keep_doing.answer")}
				question={t("q_and_a.sync_keep_doing.question")}
			/>
			<Question
				answer={t("q_and_a.wrong_calendar.answer")}
				question={t("q_and_a.wrong_calendar.question")}
			/>
			<Question
				answer={t("q_and_a.dont_show_calendar.answer")}
				question={t("q_and_a.dont_show_calendar.question")}
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
