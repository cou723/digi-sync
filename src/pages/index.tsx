import { Alert, Container, Link } from "@mui/material";

import HEAD from "@/components/head";
import ImportForm from "@/components/importForm";
import { useCustomSession } from "@/hooks/useCustomSession";

export default function Home() {
	const { authStatus } = useCustomSession();
	return (
		<>
			<HEAD />
			<Container maxWidth='sm' sx={{ pt: 2 }}>
				{authStatus == "unauthenticated" ? (
					<Alert severity='error' sx={{ my: 2 }}>
						GoogleアカウントでログインしないとGoogleカレンダーにインポートする機能は使えません。icalでダウンロードしたい方は
						<Link href='/ical'>ここ</Link>
					</Alert>
				) : (
					<ImportForm />
				)}
			</Container>
		</>
	);
}
