# chatGPT
1. まず、google-auth-library と googleapis パッケージをインストールする必要があります。これらは、Google Calendar API に認証して API リクエストを行うことができるようにするものです。次のコマンドを実行することでインストールできます:
```
npm install google-auth-library googleapis
```

2. 次に、Google API Console で OAuth 2.0 のクレデンシャルをセットアップする必要があります。こちらの手順に従って、新しいプロジェクトを作成し、Google Calendar API を有効にし、OAuth 2.0 のクレデンシャルを作成します。クレデンシャルの JSON ファイルをダウンロードし、Next.js プロジェクトに保存しておくことを忘れないでください。
3. Next.js プロジェクト内に、googleAuth.js という名前の新しいファイルを作成し、以下のコードを追加します。このコードは、先ほど作成した OAuth 2.0 のクレデンシャルを使用して、Google Calendar API に認証する処理を行います:

```ts
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

async function getAccessToken() {
  const { tokens } = await client.getToken(process.env.AUTH_CODE);
  client.setCredentials(tokens);
}

async function getCalendarEvents(calendarId) {
  await getAccessToken();
  const calendar = google.calendar({ version: 'v3', auth: client });
  const events = await calendar.events.list({ calendarId });
  return events.data.items;
}

module.exports = { getCalendarEvents };
```

4. Next.js プロジェクト内に、CalendarList.js という名前の新しいコンポーネントを作成します。このコンポーネントは、googleAuth.js 内の getCalendarEvents 関数を使用して、Google Calendar API からカレンダーのイベントのリストを取得し、リストとして表示するものです。

このように CalendarList コンポーネントを実装する例を以下に示します:

```ts
import { getCalendarEvents } from './googleAuth';

const CalendarList = ({ calendarId }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const events = await getCalendarEvents(calendarId);
      setEvents(events);
    }
    fetchEvents();
  }, []);

  return (
    <ul>
      {events.map((event) => (
        <li key={event.id}>{event.summary}</li>
      ))}
    </ul>
  );
};

export default CalendarList;
```

5. Next.js アプリケーション内で CalendarList コンポーネントを使用するには、インポートして表示したいカレンダーの calendarId を渡すことができます。例えば:

```ts
import CalendarList from './CalendarList';

const MyPage = () => {
  return (
    <div>
      <CalendarList calendarId="your-calendar-id" />
    </div>
  );
};

export default MyPage;
```
6. 最後に、OAuth 2.0 のクレデンシャルを Next.js アプリケーション内の環境変数として設定することを忘れないでください。以下の行を .env ファイルに追加することで設定できます:
```env
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
REDIRECT_URI=your-redirect-uri
AUTH_CODE=your-auth-code
```
