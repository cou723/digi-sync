# import configs
## must
- import_range: `2022-1qみたいな感じ`
  - 1q | 2q | 3q | 4q
  - 複数選択不可
- to_calendar: `id`
  - リスト形式
- dhu-portal_username: `string`
- dhu-portal_password: `string`
- is_only_jugyo: `boolean`

## option
- description: `string`
- location: `string`
- notification: `[{how_to_inform:"notification"|"mail", minutes: number}]`
  - 空だったらoff

## 実装方法
- カレンダーのリストを取得する
- ユーザーにフォームを送ってもらう
- デジキャンから授業リストを取得する
- 授業リストを元にカレンダーに予定を追加する
