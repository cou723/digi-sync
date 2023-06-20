import { Typography, Stack } from '@mui/material'
import QAndA from '../components/QAndA'

export default function q_and_a() {
    return (
        <>
            <Stack maxWidth='md'>
                <Typography variant='h4' component='h1' gutterBottom>
                    Q&A
                </Typography>
                <QAndA
                    question='このサイトは何ですか？'
                    answer='Googleカレンダーのイベントを一括削除するためのサイトです。'
                />
            </Stack>
        </>
    )
}
