import { Typography, Container } from "@mui/material";

export default function privacy_policy() {
	return (
		<>
			<Container maxWidth='md'>
				<Typography variant='h4' component='h1' gutterBottom>
					プライバシーポリシー
				</Typography>
				<Typography variant='h5' component='h2' gutterBottom>
					第1条 （個人情報取り扱いに関する基本方針）
				</Typography>
				<Typography variant='body1'>
					当サイトではログインにGoogleを利用しておりますが、それによりいかなる個人情報を収集することはありません。また、第三者に提供することもありません。
				</Typography>
				<Typography variant='body1'>
					また、メールアドレスは今現在あなたがどのアカウントでログインしているかを示すために表示されているだけで、そのほかの目的では一切利用していません。
				</Typography>
				<Typography variant='h5' component='h2' gutterBottom>
					第2条（プライバシーポリシーの変更）
				</Typography>
				<Typography variant='body1'>
					当サイトが別途定める場合を除いて、変更後のプライバシーポリシーは、当サイトに記載された際に効力を生じるものとします。
				</Typography>
			</Container>
		</>
	);
}
