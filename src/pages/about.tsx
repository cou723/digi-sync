import { Typography, Container } from "@mui/material";

export default function about() {
	return (
		<>
			<Container maxWidth='md'>
				<Typography component='h1' variant='h4'>
					このアプリケーションについて
				</Typography>
				<Typography variant='body1'>
					このアプリケーションは、デジキャンから取得したイベントをGoogleカレンダーに追加します。
				</Typography>
				<Typography component='h2' variant='h4'>
					Googleでログインした際のユーザーデータを何に扱うか
				</Typography>
				<Typography variant='body1'>
					このアプリケーションは、まず、Googleに関する情報は一切保存しません。
					<br />
					また、メールアドレスは今現在あなたがどのアカウントでログインしているかを示すために表示されているだけで、そのほかの目的では一切利用していません。
				</Typography>
			</Container>
		</>
	);
}
