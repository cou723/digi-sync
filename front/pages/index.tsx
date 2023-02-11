import ImportRange from "../components/import_module/ImportRange";
import DHUPortalData from "../components/import_module/DHUPortalData";
import ImportOptions from "../components/import_module/ImportOptions";
import ToCalendar from "../components/import_module/ToCalendar";
import {Container, Button, Stack, SelectChangeEvent, Typography} from "@mui/material";
import {useState, useEffect, useCallback, ChangeEvent, ReactNode} from "react";
import {useSession, signIn, signOut} from "next-auth/react";
import Head from "next/head";

type Inputs = {
    importRange: string;
    toCalendar: string;
    username: string;
    password: string;
    ignoreOtherEvents: boolean;
    [key: string]: string | boolean;
};

type ClassEvent = {
    allDay: boolean;
    className: string;
    editable: boolean;
    end: string;
    id: string;
    start: string;
    title: string;
};

function get_end_time(start: string): string {
    const end_date_unix_timestamp = Date.parse(start) + 60 * 90 * 1000;
    const end_date: Date = new Date(end_date_unix_timestamp);
    end_date.setMinutes(end_date.getMinutes());
    return end_date.toISOString().slice(0, -5) + "+0000";
}

const FORM_STATE_INIT_VALUE: Inputs = {importRange: "", toCalendar: "", username: "", password: "", ignoreOtherEvents: true} as Inputs;

export default function Home() {
    let [formState, setFormState] = useState<Inputs>(FORM_STATE_INIT_VALUE);
    let [accessToken, setAccessToken] = useState<string>("");
    let [importCount, setImportCount] = useState<number>(0);
    let [totalImportCount, setTotalImportCount] = useState<number>(0);

    let [importRangeError, setImportRangeError] = useState<string>("");
    let [calendarInputError, setCalendarInputError] = useState<string>("");
    let [dhuPortalInputError, setDhuPortalInputError] = useState({username: "", password: ""});

    let [appState, setAppState] = useState<"unauthenticated" | "ready" | "connect portal" | "import">("unauthenticated");

    const {data: session, status: authStatus} = useSession();

    useEffect(() => {
        if (authStatus == "unauthenticated") setAppState("unauthenticated");
        else setAppState("ready");
    }, [authStatus]);

    useEffect(() => {
        if (appState == "import") {
            window.onbeforeunload = function () {
                return "Are you sure you want to leave this page?";
            };
        } else {
            window.onbeforeunload = null;
        }

        return () => {
            window.onbeforeunload = null;
        };
    }, [appState]);

    const importCountIncrement = () => setImportCount((prevCount) => prevCount + 1);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormState({
            ...formState,
            [event.target.name]: value,
        });
    };

    const handleSelectChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
        const value = event.target.value;
        setFormState({
            ...formState,
            [event.target.name]: value,
        });
    };

    async function addEventToGoogleCal(start: string, title: string) {
        let url = `https://www.googleapis.com/calendar/v3/calendars/${formState.toCalendar}/events`;
        console.log(url);
        // TODO エラー処理
        if (!(session && session.user)) return;
        let res = await fetch(url, {
            method: "POST",
            headers: {Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json"},
            body: JSON.stringify({
                end: {dateTime: get_end_time(start)},
                start: {dateTime: start},
                summary: title,
                description: "#created_by_dp2gc",
            }),
        });
        if (res.status >= 400) {
            res.json().then((data) => {
                console.log(data);
            });
            throw new Error(`${res.status} : Bad response from server`);
        }
        importCountIncrement();
    }

    const postToGoogleCalendar = async (class_events: Array<any>) => {
        for (const class_event of class_events) {
            try {
                await addEventToGoogleCal(class_event.start, class_event.title);
            } catch (error) {
                console.error(error);
                break;
            }
        }
    };

    const getEventList = async () => {
        setAppState("connect portal");
        let res;
        try {
            res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/get_dhu_event_list?" + new URLSearchParams({importRange: formState.importRange, username: formState.username, password: formState.password}).toString(), {method: "GET"});
        } catch {
            throw new Error("サーバーに接続できませんでした");
        }
        const data = await res.json();
        if (data.status_code == "401" && data.detail == "user id or password is invalid") throw new Error("ユーザー名またはパスワードが違います");
        return data;
    };

    function existsStateEmpty() {
        for (let input_label of Object.keys(formState)) {
            if (typeof FORM_STATE_INIT_VALUE[input_label] == "string" && FORM_STATE_INIT_VALUE[input_label] == formState[input_label]) return true;
        }
        return false;
    }

    function resetErrorMessage() {
        setImportRangeError("");
        setCalendarInputError("");
        setDhuPortalInputError({username: "", password: ""});
    }

    function setErrorMessages() {
        if (formState.importRange == FORM_STATE_INIT_VALUE.importRange) setImportRangeError("インポート範囲が指定されていません");
        if (formState.toCalendar == FORM_STATE_INIT_VALUE.toCalendar) setCalendarInputError("インポート先のカレンダーが指定されていません");
        let username_error_msg = "";
        if (formState.username == FORM_STATE_INIT_VALUE.username) username_error_msg = "ユーザー名を入力してください";
        let password_error_msg = "";
        if (formState.password == FORM_STATE_INIT_VALUE.password) password_error_msg = "パスワードを入力してください";
        setDhuPortalInputError({username: username_error_msg, password: password_error_msg});
    }

    const onImportClick = async () => {
        resetErrorMessage();
        if (existsStateEmpty()) {
            setErrorMessages();
            return;
        }
        let data;
        try {
            data = await getEventList();
        } catch (e: any) {
            alert(e.message);
            setAppState("ready");
            return;
        }
        setAppState("import");
        let class_events = formState.ignoreOtherEvents ? data.events.filter((e: ClassEvent) => e.className.indexOf("eventJugyo") !== -1) : data.events;
        setImportCount(0);
        setTotalImportCount(class_events.length);
        await postToGoogleCalendar(class_events);
        setAppState("ready");
    };

    return (
        <>
            <Container maxWidth="sm">
                <Stack spacing={2} component="form" autoComplete="off" action="/import">
                    <ImportRange error={importRangeError} value={formState.importRange} onChange={handleSelectChange} />
                    <ToCalendar error={calendarInputError} value={formState.toCalendar} onChange={handleSelectChange} setAccessToken={setAccessToken} />
                    <DHUPortalData error={dhuPortalInputError} username={formState.username} password={formState.password} onChange={handleInputChange} />
                    <ImportOptions value={formState.ignoreOtherEvents} onChange={handleInputChange} />
                    <input type="hidden" name="accessToken" value={accessToken} />
                    <br />
                    <Button disabled={appState == "unauthenticated" || appState == "connect portal" || appState == "import"} variant="contained" onClick={onImportClick}>
                        {appState == "connect portal" ? "デジキャンから読み込んでいます..." : ""}
                        {appState == "import" ? `(${importCount}件/${totalImportCount}件)` : ""}
                        {appState == "unauthenticated" ? "Googleアカウントにログインしてください" : "インポート"}
                    </Button>
                </Stack>
            </Container>
        </>
    );
}
