import {Typography, Container} from "@mui/material";

export default function privacy_policy() {
    return (
        <>
            <Container maxWidth="md">
                <Typography variant="h2" gutterBottom>
                    プライバシーポリシー
                </Typography>
                <Typography variant="body1">
                    当サイトでは、Googleアカウントを利用したログインを行っています。 ですが、Googleアカウントの情報を保存することはありません。
                    <br />
                    また、Googleアカウントの情報を第三者に提供することもありません。
                </Typography>
            </Container>
        </>
    );
}
