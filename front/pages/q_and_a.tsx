import { Typography, Container } from "@mui/material";
import { useTranslation } from "next-i18next";
import Question from "../components/QAndA";

type QA = {
    question: string;
    answer: string;
};

export default function QAndA() {
    const { t } = useTranslation();
    const question_list = t("q_and_a");
    return (
        <Container sx={{ py: 2 }} maxWidth='sm'>
            <Typography variant='h4' component='h1' gutterBottom>
                Q&A
                {question_list}
            </Typography>
            <Question
                question='このサイトは何ですか？'
                answer='デジキャンで表示される授業一覧を、Google Calendarに同期させたり、.ical形式でダウンロードすることができるサイトです。'
            />
            <Question
                question='休講になった授業があるのですが、自動で削除されません'
                answer={
                    "Google Calendarと常に同期しているわけではないので、休講になった授業を削除するには、再度同期を実行してください。\n" +
                    "なおその場合、Google Calendarに同期させた予定を削除する必要はありません。"
                }
            />
            <Question
                question='一度同期すれば同期し続けてくれるんですか？'
                answer={
                    "いいえ。\nインポートしたその瞬間の授業予定を同期するので、\n" +
                    "その都度インポートしてください。また、すでに予定が追加されている\n" +
                    "カレンダーに対して予定を追加すると追加されていない予定のみを追加します。(Google Calendarへのインポートのみ)\n" +
                    "そのため、Google カレンダーにある予定を更新したい場合は再び" +
                    "同期を実行してもらえば、不足分を追加したり、休講になった授業を自動的に削除します。"
                }
            />
            <Question
                question='まちがえて別のカレンダーに予定を追加してしまいました'
                answer='一括削除機能を使って予定を一括削除した後に、本来インポートしたかったカレンダーを選択したインポートしてください。'
            />
            <Question
                question='カレンダー一覧に同期させたいカレンダーが表示されない'
                answer='自分で編集できるGoogle Calendarしか表示させていないので、自分で編集できるカレンダーに変更してください。'
            />
        </Container>
    );
}
