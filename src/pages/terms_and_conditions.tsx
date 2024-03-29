import { Typography, Container } from "@mui/material";

export default function privacy_policy() {
	return (
		<>
			<Container maxWidth='md'>
				<Typography component='h1' gutterBottom variant='h4'>
					利用規約
				</Typography>
				<Typography variant='body1'>
					当サイトを用いて発生したいかなる損害についても、当サイトの運営者は一切の責任を負いません。
				</Typography>
			</Container>
		</>
	);
}
