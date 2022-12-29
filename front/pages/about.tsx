import {Typography, Container} from "@mui/material";

export default function about() {
    return (
        <>
            <Container maxWidth="md">
                <Typography variant="h4" component="h1">
                    このアプリケーションについて
                </Typography>
                <Typography variant="body1">このアプリケーションは、デジタルキャンパスから取得したイベントをGoogleカレンダーにインポートするためのものです。</Typography>
            </Container>
        </>
    );
}
