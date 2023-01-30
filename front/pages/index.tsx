import ImportRange from "../components/import_module/ImportRange";
import DHUPortalData from "../components/import_module/DHUPortalData";
import ImportOptions from "../components/import_module/ImportOptions";
import ToCalendar from "../components/import_module/ToCalendar";
import {Container, Button, Stack, SelectChangeEvent, Typography} from "@mui/material";
import {useState, ChangeEvent, ReactNode} from "react";
import {useSession, signIn, signOut} from "next-auth/react";
import Head from "next/head";

type Inputs = {
    importRange: string;
    username: string;
    password: string;
    ignoreOtherEvents: boolean;
    toCalendar: string;
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

export default function Home() {
    let [state, setState] = useState<Inputs>({importRange: "", username: "", password: "", ignoreOtherEvents: true, toCalendar: ""} as Inputs);
    let [accessToken, setAccessToken] = useState<string>("");
    let [isImporting, setIsImporting] = useState<boolean>(false);
    let [importCount, setImportCount] = useState<number>(0);
    let [totalImportCount, setTotalImportCount] = useState<number>(0);
    let [isDHUPortalWaiting, setIsDHUPortalWaiting] = useState<boolean>(false);
    const {data: session, status} = useSession();

    const importCountIncrement = () => setImportCount((prevCount) => prevCount + 1);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setState({
            ...state,
            [event.target.name]: value,
        });
    };
    const handleSelectChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
        const value = event.target.value;
        setState({
            ...state,
            [event.target.name]: value,
        });
    };

    async function addEventToGoogleCal(start: string, title: string) {
        let url = `https://www.googleapis.com/calendar/v3/calendars/${state.toCalendar}/events`;
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
        setIsImporting(false);
    };

    const getEventList = async () => {
        setIsDHUPortalWaiting(true);
        const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/get_dhu_event_list?" + new URLSearchParams({importRange: state.importRange, username: state.username, password: state.password}).toString(), {method: "GET"});
        const data = await res.json();
        setIsDHUPortalWaiting(false);
        if (data.status_code == "401" && data.detail == "user id or password is invalid") {
            alert("ユーザーIDかパスワードが間違っています");
            throw new Error("");
        }
        return data;
    };

    const onImportClick = async () => {
        let data;
        try {
            data = await getEventList();
        } catch (e) {
            //TODO: エラー処理
            return;
        }
        let class_events = state.ignoreOtherEvents ? data.events.filter((e: ClassEvent) => e.className.indexOf("eventJugyo") !== -1) : data.events;
        setIsImporting(true);
        setImportCount(0);
        setTotalImportCount(class_events.length);
        postToGoogleCalendar(class_events);
    };

    return (
        <>
            <Head>
                <meta name="google-site-verification" content="YRVBxjKFSCa5gYxDgaLk0sjJFCDBkJ0z7IcFereoi1w" />
            </Head>
            <Container maxWidth="sm">
                <Stack spacing={2} component="form" autoComplete="off" action="/import">
                    <ImportRange value={state.importRange} onChange={handleSelectChange} />
                    <ToCalendar value={state.toCalendar} onChange={handleSelectChange} setAccessToken={setAccessToken} />
                    <DHUPortalData username={state.username} password={state.password} onChange={handleInputChange} />
                    <ImportOptions value={state.ignoreOtherEvents} onChange={handleInputChange} />
                    <input type="hidden" name="accessToken" value={accessToken} />
                    <br />
                    <Button disabled={!(status === "authenticated") || isDHUPortalWaiting || isImporting ? true : false} variant="contained" onClick={onImportClick}>
                        {isDHUPortalWaiting ? "デジキャンから読み込んでいます..." : ""}
                        {isImporting ? `(${importCount}件/${totalImportCount}件)` : ""}
                        {status == "authenticated" ? "インポート" : "Googleアカウントにログインしてください"}
                    </Button>
                </Stack>
            </Container>
        </>
    );
}
