import { Typography, Container } from "@mui/material";

type Props = {
	answer: string;
	question: string;
};

export default function QAndA({ question, answer }: Props) {
	return (
		<Container sx={{ py: 2 }} maxWidth='md'>
			<Typography variant='h5' component='h2' gutterBottom>
				Q. {question}
			</Typography>
			<Typography sx={{ px: 2 }} variant='body1' style={{ whiteSpace: "pre-line" }}>
				A.{answer}
			</Typography>
		</Container>
	);
}
