import { Typography, Container } from "@mui/material";

type Props = {
	answer: string;
	question: string;
};

const QAndA = ({ question, answer }: Props) => {
	return (
		<Container maxWidth='md' sx={{ py: 2 }}>
			<Typography component='h2' gutterBottom variant='h5'>
				Q. {question}
			</Typography>
			<Typography style={{ whiteSpace: "pre-line" }} sx={{ px: 2 }} variant='body1'>
				A.{answer}
			</Typography>
		</Container>
	);
};

export default QAndA;
