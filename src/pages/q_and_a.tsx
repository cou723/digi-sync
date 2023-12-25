import { Typography, Container } from "@mui/material";

import Question from "@/components/qAndA";

export default function QAndA() {
	return (
		<Container maxWidth='sm' sx={{ py: 2 }}>
			<Typography component='h1' gutterBottom variant='h4'>
				Q&A
			</Typography>
			<Question
				answer='自分で編集できるGoogle Calendarしか表示させていないので、自分で編集できるカレンダーに変更してください。'
				question='カレンダー一覧に同期させたいカレンダーが表示されない'
			/>
			<Question
				answer='Google Calendarと常に同期しているわけではないので、休講になった授業を削除するには、再度同期を実行してください。\nなおその場合、Google Calendarに同期させた予定を削除する必要はありません。'
				question='休講になった授業があるのですが、自動で削除されません'
			/>
			<Question
				answer='いいえ。\nインポートしたその瞬間の授業予定を同期するので、\nその都度インポートしてください。また、すでに予定が追加されている\nカレンダーに対して予定を追加すると追加されていない予定のみを追加します。(Google Calendarへのインポートのみ)\nそのため、Google カレンダーにある予定を更新したい場合は再び同期を実行してもらえば、不足分を追加したり、休講になった授業を自動的に削除します。'
				question='一度同期すれば同期し続けてくれるんですか？'
			/>
			<Question
				answer='デジキャンで表示される授業一覧を、Google Calendarに同期させたり、.ical形式でダウンロードすることができるサイトです。'
				question='このサイトは何ですか？'
			/>
			<Question
				answer='一括削除機能を使って予定を一括削除した後に、本来インポートしたかったカレンダーを選択したインポートしてください。'
				question='まちがえて別のカレンダーに予定を追加してしまいました'
			/>
		</Container>
	);
}
