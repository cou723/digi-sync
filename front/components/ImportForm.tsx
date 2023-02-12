import ImportRange from "./import_module/ImportRange";
import DHUPortalData from "./import_module/DHUPortalData";
import ImportOptions from "./import_module/ImportOptions";
import ToCalendar from "./import_module/ToCalendar";
import {Button, Stack, SelectChangeEvent, Select, InputLabel, FormControl, MenuItem} from "@mui/material";
import {useState, useEffect, ChangeEvent, ReactNode} from "react";
import {useSession} from "next-auth/react";
import type {CalendarList, Event} from "../gapi_calendar.d.ts";
import {start} from "repl";

type Inputs = {
    importYear: string;
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

const FORM_STATE_INIT_VALUE: Inputs = {
    importYear: (new Date().getFullYear() - 1).toString(),
    importRange: "",
    toCalendar: "",
    username: "",
    password: "",
    ignoreOtherEvents: true,
} as Inputs;

type Range = {start: Date; end: Date};
function get_quarter_ranges(year: number) {
    return {
        _1q_start: new Date(year, 4 - 1, 1),
        _2q_start: new Date(year, 6 - 1, 10),
        _3q_start: new Date(year, 9 - 1, 1),
        _4q_start: new Date(year, 11 - 1, 25),

        _1q_end: new Date(year, 6 - 1, 9, 23, 59, 59),
        _2q_end: new Date(year, 8 - 1, 31, 23, 59, 59),
        _3q_end: new Date(year, 11 - 1, 24, 23, 59, 59),
        _4q_end: new Date(year + 1, 2 - 1, new Date(year, 2, 0).getDate(), 23, 59, 59),
    };
}

const INIT_REQUIRE_VALUE_LIST = ["importRange", "toCalendar", "username", "password"];

export default function ImportForm() {
    let [formState, setFormState] = useState<Inputs>(FORM_STATE_INIT_VALUE);
    let [accessToken, setAccessToken] = useState<string>("");
    let [importCount, setImportCount] = useState<number>(0);
    let [totalImportCount, setTotalImportCount] = useState<number>(0);

    let [importRangeError, setImportRangeError] = useState<string>("");
    let [calendarInputError, setCalendarInputError] = useState<string>("");
    let [dhuPortalInputError, setDhuPortalInputError] = useState({username: "", password: ""});

    let [appState, setAppState] = useState<"unauthenticated" | "ready" | "connect portal" | "import">("unauthenticated");

    let selectableYears: Array<number> = new Array<number>(new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1);
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

    const handleSelectChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
        const value = event.target.value;
        setFormState({
            ...formState,
            [event.target.name]: value,
        });
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormState({
            ...formState,
            [event.target.name]: value,
        });
    };

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
        let class_events: Array<ClassEvent> = data.events;
        if (formState.ignoreOtherEvents) class_events = data.events.filter((e: ClassEvent) => e.className.indexOf("eventJugyo") !== -1);
        setImportCount(0);
        await postToGoogleCalendar(class_events);
        setAppState("ready");
    };

    const getEventList = async () => {
        setAppState("connect portal");
        let res;
        let query_param_obj = {
            importYear: formState.importYear,
            importRange: formState.importRange,
            username: formState.username,
            password: formState.password,
        };
        let query_param_str = new URLSearchParams(query_param_obj).toString();
        try {
            res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/get_dhu_event_list?" + query_param_str, {method: "GET"});
            res = await res.json();
        } catch {
            throw new Error("サーバーに接続できませんでした");
        }
        if (res.status_code == "401" && res.detail == "user id or password is invalid") throw new Error("ユーザー名またはパスワードが違います");
        return res;
    };

    function existsStateEmpty() {
        for (let input_label of Object.keys(formState)) {
            if (INIT_REQUIRE_VALUE_LIST.includes(input_label) && FORM_STATE_INIT_VALUE[input_label] == formState[input_label]) return true;
        }
        return false;
    }

    function resetErrorMessage() {
        setImportRangeError(FORM_STATE_INIT_VALUE.importRange);
        setCalendarInputError(FORM_STATE_INIT_VALUE.toCalendar);
        setDhuPortalInputError({username: FORM_STATE_INIT_VALUE.username, password: FORM_STATE_INIT_VALUE.password});
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

    const postToGoogleCalendar = async (class_events: Array<ClassEvent>) => {
        if (!(session && session.user)) return;
        let res_obj: CalendarList;
        let next_page_token: string = "";
        let already_posted_event_list: Array<Event> = [];
        do {
            let {start, end} = get_quarter_range(+formState.importYear, formState.importRange);
            let query_param_obj;
            if (next_page_token != "")
                query_param_obj = {
                    pageToken: next_page_token,
                };
            else
                query_param_obj = {
                    maxResults: 2000,
                    timeMax: end.toISOString(),
                    timeMin: start.toISOString(),
                    orderBy: "startTime",
                    singleEvents: true,
                };
            console.log(start.toISOString(), end.toISOString());
            let query_param_str = new URLSearchParams(query_param_obj).toString();
            let google_api_url = `https://www.googleapis.com/calendar/v3/calendars/${formState.toCalendar}/events?${query_param_str}`;
            let res = await fetch(google_api_url, {
                method: "GET",
                headers: {Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json"},
            });
            res_obj = await res.json();
            console.log(res_obj);
            if (res_obj.hasOwnProperty("error")) throw Error(`status ${res_obj.status}`);
            if (res_obj.nextPageToken) next_page_token = res_obj.nextPageToken;
            already_posted_event_list.push(...res_obj.items);
        } while (res_obj.hasOwnProperty("nextPageToken"));
        console.log(res_obj.items);
        // TODO: res.statusが400と500のときのエラー処理
        class_events = class_events.filter((class_event, i) => !is_event_duplicated(already_posted_event_list, class_event));
        let {start, end} = get_quarter_range(parseInt(formState.importYear), formState.importRange);
        // importRange外の授業を削除する
        class_events = class_events.filter((class_event, i) => new Date(class_event.start).getTime() > start.getTime() && new Date(class_event.start).getTime() < end.getTime());
        setTotalImportCount(class_events.length);
        for (const class_event of class_events) {
            try {
                await addEventToGoogleCal(class_event.start, class_event.title);
            } catch (error) {
                console.error(error);
                break;
            }
        }
    };

    function get_quarter_range(year: number, importRange: string): Range {
        let r = get_quarter_ranges(year);
        if (importRange == "1q") return {start: r._1q_start, end: r._1q_end};
        else if (importRange == "2q") return {start: r._2q_start, end: r._2q_end};
        else if (importRange == "3q") return {start: r._3q_start, end: r._3q_end};
        else if (importRange == "4q") return {start: r._4q_start, end: r._4q_end};
        else if (importRange == "1q_and_2q") return {start: r._1q_start, end: r._2q_end};
        return {start: r._3q_start, end: r._4q_end};
    }

    async function addEventToGoogleCal(start: string, title: string) {
        if (!(session && session.user)) return;
        let google_api_url = `https://www.googleapis.com/calendar/v3/calendars/${formState.toCalendar}/events`;
        let res = await fetch(google_api_url, {
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
        setImportCount((prevCount) => prevCount + 1);
    }

    //fkjdskf

    // If we sort Event, we can bisect the search by date.
    function is_event_duplicated(already_posted_event_list: Event[], class_event: ClassEvent): boolean {
        for (const already_posted_event of already_posted_event_list) {
            if (!already_posted_event.start.dateTime) continue;
            if (class_event.title == already_posted_event.summary && new Date(class_event.start).toISOString() == new Date(already_posted_event.start.dateTime).toISOString()) return true;
        }
        return false;
    }

    return (
        <Stack spacing={2} component="form" autoComplete="off" action="/import">
            <FormControl margin="normal">
                <InputLabel id="import-year-label">インポート年度</InputLabel>
                <Select value={formState.importYear} onChange={handleSelectChange} name="importYear" labelId="import-year-label" label="インポート先カレンダー" margin="dense">
                    {selectableYears.map((selectableYear: number, i: number) => (
                        <MenuItem value={selectableYear} key={i}>
                            {selectableYear}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
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
    );
}
