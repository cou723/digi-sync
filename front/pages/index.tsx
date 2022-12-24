import Header from "../components/Header";
import ImportRange from "../components/import_module/ImportRange";
import DHUPortalData from "../components/import_module/DHUPortalData";
import ImportOptions from "../components/import_module/ImportOptions";
import ToCalendar from "../components/import_module/ToCalendar";
import {Container, Button, Stack, SelectChangeEvent} from "@mui/material";
import {useState, ChangeEvent, ReactNode} from "react";
import axios, {AxiosResponse} from "axios";

const API_SERVER_URL: string = "http://localhost:8000";

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
    const end_date_unix_timestamp = Date.parse(start) + 60 * 90;
    const end_date: Date = new Date(end_date_unix_timestamp);
    end_date.setMinutes(end_date.getMinutes() + 90);
    return end_date.toISOString();
}

export default function Home() {
    let [state, setState] = useState<Inputs>({importRange: "", username: "", password: "", ignoreOtherEvents: true, toCalendar: ""} as Inputs);
    let [accessToken, setAccessToken] = useState<string>("");
    let [isImporting, setIsImporting] = useState<boolean>(false);
    let [importCount, setImportCount] = useState<number>(0);
    let [totalImportCount, setTotalImportCount] = useState<number>(0);
    let [isDHUPortalWaiting, setIsDHUPortalWaiting] = useState<boolean>(false);

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
        console.log(state);
    };

    const callGoogleAPI = (start: string, title: string) => {
        console.log("call");

        axios
            .post(
                `https://www.googleapis.com/calendar/v3/calendars/${state.toCalendar}/events`,
                {
                    start: {dateTime: start},
                    end: {dateTime: get_end_time(start)},
                    summary: title,
                    description: "#created_by_dp2gc",
                },
                {
                    headers: {Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json"},
                }
            )
            .then((res) => {
                if (res.status >= 400) throw new Error("Bad response from server");
                importCountIncrement();
            });
    };

    function processArray(class_events: Array<any>, i: number) {
        if (i >= class_events.length) {
            setIsImporting(false);
            return;
        }
        callGoogleAPI(class_events[i].start, class_events[i].summary);
        setTimeout(() => processArray(class_events, i + 1), 200);
    }

    const onImportClick = async () => {
        setIsDHUPortalWaiting(true);
        let res = await axios.get("http://localhost:8000/get_dhu_event_list", {params: {importRange: state.importRange, username: state.username, password: state.password}});
        if (res.data.status_code == "401" && res.data.detail == "user id or password is invalid") {
            alert("ユーザーIDかパスワードが間違っています");
            return;
        }
        setIsDHUPortalWaiting(false);
        let class_events = state.ignoreOtherEvents ? res.data.events.filter((e: ClassEvent) => e.className.indexOf("eventJugyo") !== -1) : res.data.events;
        setIsImporting(true);
        setImportCount(0);
        setTotalImportCount(class_events.length);
        console.log("finished!");
        processArray(class_events, 0);
    };

    return (
        <>
            <Header />

            <Container maxWidth="sm">
                <Stack spacing={2} component="form" autoComplete="off" action="/import">
                    <ImportRange value={state.importRange} onChange={handleSelectChange} />
                    <ToCalendar value={state.toCalendar} onChange={handleSelectChange} setAccessToken={setAccessToken} />
                    <DHUPortalData username={state.username} password={state.password} onChange={handleInputChange} />
                    <ImportOptions value={state.ignoreOtherEvents} onChange={handleInputChange} />
                    <input type="hidden" name="accessToken" value={accessToken} />
                    インポートを何度も押さないでください
                    <br />
                    <Button {...(isDHUPortalWaiting || isImporting ? {disabled:} : {})} variant="contained" onClick={onImportClick}>
                        インポート {isDHUPortalWaiting ? "デジキャンから読み込んでいます..." : ""}
                        {isImporting ? `(${importCount}件/${totalImportCount}件)` : ""}
                    </Button>
                </Stack>
            </Container>
        </>
    );
}
