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

export default function Home() {
    let [state, setState] = useState<Inputs>({importRange: "", username: "", password: "", ignoreOtherEvents: true, toCalendar: ""} as Inputs);
    let [accessToken, setAccessToken] = useState<string>("");
    const {data: session} = useSession();

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

    const onImportClick = () => {
        console.log(state, accessToken);
        axios.defaults.baseURL = "http://localhost:3000";
        axios.get("http://localhost:8000/get_dhu_event_list", {params: {importRange: state.importRange, username: state.username, password: state.password}}).then((res) => {
            console.log(res);
            let class_events: ClassEvent[] = res.data.events.filter((e: ClassEvent) => e.className.indexOf("eventJugyo") !== -1);
            for (let event of class_events) {
                axios.post(
                    `https://www.googleapis.com/calendar/v3/calendars/${state.toCalendar}/events`,
                    {
                        start: {dateTime: event.start},
                        end: {dateTime: event.end},
                        summary: event.title,
                        description: "#created_by_dp2gc",
                    },
                    {
                        headers: {Authorization: `Bearer ${accessToken}`,'Content-Type': 'application/json'},
                    }
                );
            }
            if (!session) return;
        });
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
