import Header from "../components/Header";
import ImportRange from "../components/import_module/ImportRange";
import DHUPortalData from "../components/import_module/DHUPortalData";
import ImportOptions from "../components/import_module/ImportOptions";
import ToCalendar from "../components/import_module/ToCalendar";
import {Container, Button, Stack, SelectChangeEvent} from "@mui/material";
import {useState, ChangeEvent, ReactNode} from "react";
import axios from "axios";
import {useSession} from "next-auth/react";

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
    const handleSubmit = () => {
        console.log("submit");
    };

    const onImportClick = async () => {
        let res = await axios.get("http://localhost:8000/get_dhu_event_list", {params: {importRange: state.importRange, username: state.username, password: state.password}});
        let class_events = state.ignoreOtherEvents ? res.data.events.filter((e: ClassEvent) => e.className.indexOf("eventJugyo") !== -1) : res.data.events;
        for (let event of class_events) {
            await axios.post(
                `https://www.googleapis.com/calendar/v3/calendars/${state.toCalendar}/events`,
                {
                    start: {dateTime: event.start},
                    end: {dateTime: get_end_time(event.start)},
                    summary: event.title,
                    description: "#created_by_dp2gc",
                },
                {
                    headers: {Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json"},
                }
            );
            await new Promise((s) => setTimeout(s, 50));
        }
    };

    return (
        <>
            <Header />

            <Container maxWidth="sm">
                <Stack spacing={2} component="form" onSubmit={handleSubmit} autoComplete="off" action="/import">
                    <ImportRange value={state.importRange} onChange={handleSelectChange} />
                    <ToCalendar value={state.toCalendar} onChange={handleSelectChange} setAccessToken={setAccessToken} />
                    <DHUPortalData username={state.username} password={state.password} onChange={handleInputChange} />
                    <ImportOptions value={state.ignoreOtherEvents} onChange={handleInputChange} />
                    <input type="hidden" name="accessToken" value={accessToken} />
                    <Button variant="contained" onClick={onImportClick}>
                        インポート
                    </Button>
                </Stack>
            </Container>
        </>
    );
}
