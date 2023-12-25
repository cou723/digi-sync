import { Container } from "@mui/material";

import HEAD from "@/components/head";
import { ImportIcalForm } from "@/components/importIcalForm";

export default function Home() {
	return (
		<>
			<HEAD />
			<Container maxWidth='sm' sx={{ pt: 2 }}>
				<ImportIcalForm />
			</Container>
		</>
	);
}
