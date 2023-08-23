import { Container } from "@mui/material";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import HEAD from "../components/head";
import { ImportIcalForm } from "../components/importIcalForm";

export default function Home() {
	return (
		<>
			<HEAD />
			<Container sx={{ pt: 2 }} maxWidth='sm'>
				<ImportIcalForm />
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
