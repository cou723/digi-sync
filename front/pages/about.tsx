import { Typography, Container } from '@mui/material'

export default function about() {
    return (
        <>
            <Container maxWidth='md'>
                <Typography variant='h4' component='h1'>
                    このアプリケーションについて
                </Typography>
                <Typography variant='body1'>
                    このアプリケーションは、デジキャンから取得したイベントをGoogleカレンダーに追加します。
                </Typography>
                <Typography variant='h4' component='h2'>
                    Googleでログインした際のユーザーデータを何に扱うか
                </Typography>
                <Typography variant='body1'>
                    このアプリケーションは、まず、Googleに関する情報は一切保存しません。
                    <br />
                    また、メールアドレスは今現在あなたがどのアカウントでログインしているかを示すために表示されているだけで、そのほかの目的では一切利用していません。
                </Typography>
            </Container>
        </>
    )
}
