import { Typography, Container } from '@mui/material'

type Props = {
    question: string
    answer: string
}

export default function QAndA({ question, answer }: Props) {
    return (
        <Container maxWidth='md'>
            <Typography variant='h5' component='h2' gutterBottom>
                Q. {question}
            </Typography>
            <Typography variant='body1'>
                A. {answer}
            </Typography>
        </Container>
    );
}
