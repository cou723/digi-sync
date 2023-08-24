import { Typography, Container } from "@mui/material";

export default function NotFound() {
	return (
		<>
			<Container maxWidth='md'>
				<Typography component='h1' variant='h4'>
					404 Not Found
				</Typography>
			</Container>
		</>
	);
}
