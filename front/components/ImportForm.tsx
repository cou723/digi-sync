import ImportRange from "./ImportModules/ImportRange";
import DHUPortalData from "./ImportModules/DHUPortalData";
import ImportOptions from "./ImportModules/ImportOptions";
import ToCalendar from "./ImportModules/ToCalendar";
import AllDeleteButton from "./ImportModules/AllDeleteButton";
import {Button, Stack, SelectChangeEvent, Select, InputLabel, FormControl, MenuItem} from "@mui/material";
import {useState, useEffect, ChangeEvent, ReactNode} from "react";
import {useSession} from "next-auth/react";
import type {CalendarList, Event} from "../types/gapi_calendar";
import {encodeQueryData, getEndTime, getQuarterRange, isGetEventErrorObject, GetEventsErrorObject} from "../libs/utils";
import {Inputs, ClassEvent} from "../types/types";

const FORM_STATE_INIT_VALUE: Inputs = {
    importYear: (new Date().getFullYear() - 1).toString(),
    importRange: "",
    toCalendar: "",
    username: "",
    password: "",
    ignoreOtherEvents: true,
} as Inputs;

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
        if (formState.ignoreOtherEvents) {
            class_events = data.events.filter((e: ClassEvent) => e.className.indexOf("eventJugyo") !== -1);
        }
        setImportCount(0);
        class_events = excludeOutOfImportRange(class_events);
        await postToGoogleCalendar(class_events);
        setAppState("ready");
    };

    function existsStateEmpty() {
        for (let input_label of Object.keys(formState)) {
            if (INIT_REQUIRE_VALUE_LIST.includes(input_label) && FORM_STATE_INIT_VALUE[input_label] == formState[input_label]) return true;
        }
        return false;
    }

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
            throw new Error("?????????????????????????????????????????????");
        }
        if (res.status_code == "401" && res.detail == "user id or password is invalid") throw new Error("??????????????????????????????????????????????????????");
        return res;
    };

    function resetErrorMessage() {
        setImportRangeError(FORM_STATE_INIT_VALUE.importRange);
        setCalendarInputError(FORM_STATE_INIT_VALUE.toCalendar);
        setDhuPortalInputError({username: FORM_STATE_INIT_VALUE.username, password: FORM_STATE_INIT_VALUE.password});
    }

    function setErrorMessages() {
        if (formState.importRange == FORM_STATE_INIT_VALUE.importRange) {
            setImportRangeError("???????????????????????????????????????????????????");
        }
        if (formState.toCalendar == FORM_STATE_INIT_VALUE.toCalendar) {
            setCalendarInputError("??????????????????????????????????????????????????????????????????");
        }
        let username_error_msg = "";
        if (formState.username == FORM_STATE_INIT_VALUE.username) {
            username_error_msg = "??????????????????????????????????????????";
        }
        let password_error_msg = "";
        if (formState.password == FORM_STATE_INIT_VALUE.password) {
            password_error_msg = "??????????????????????????????????????????";
        }
        setDhuPortalInputError({username: username_error_msg, password: password_error_msg});
    }

    function excludeOutOfImportRange(class_events: ClassEvent[]): ClassEvent[] {
        let {start: start_date, end: end_date} = getQuarterRange(parseInt(formState.importYear), formState.importRange);
        let start = start_date.getTime();
        let end = end_date.getTime();
        return class_events.filter((class_event) => {
            let start_date = new Date(class_event.start).getTime();
            return start_date > start && start_date < end;
        });
    }

    // class_events???google???????????????
    const postToGoogleCalendar = async (class_events: Array<ClassEvent>) => {
        if (!session) return;
        let already_posted_event_list: Array<Event>;
        try {
            already_posted_event_list = await getAlreadyPostedEvents(session);
            class_events = class_events.filter((class_event) => !isEventDuplicated(already_posted_event_list, class_event));
        } catch (e) {
            alert("Google Calendar?????????????????????????????????????????????????????????????????????");
            return;
        }
        setTotalImportCount(class_events.length);
        for (const class_event of class_events) {
            addEventToGoogleCal(class_event.start, class_event.title);
            await new Promise(function (resolve) {
                setTimeout(resolve, 300);
            });
        }
        if (class_events.length == 0) alert(`?????????????????????Google Calendar?????????????????????????????????????????????????????????????????????`);
        else alert(`${class_events.length}??????????????????????????????????????????`);
    };

    async function getAlreadyPostedEvents(session: any) {
        let res: CalendarList | GetEventsErrorObject;
        let next_page_token: string = "";
        let already_posted_events: Array<Event> = [];
        const {start, end} = getQuarterRange(parseInt(formState.importYear), formState.importRange);
        do {
            let query_param: object;
            if (next_page_token != "") query_param = {pageToken: next_page_token};
            else
                query_param = {
                    maxResults: 2000,
                    timeMax: end.toISOString(),
                    timeMin: start.toISOString(),
                    orderBy: "startTime",
                    singleEvents: true,
                };
            const google_api_url = `https://www.googleapis.com/calendar/v3/calendars/${formState.toCalendar}/events?${encodeQueryData(query_param)}`;
            const raw_response = await fetch(google_api_url, {
                method: "GET",
                headers: {Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json"},
            });
            res = await raw_response.json();
            if (isGetEventErrorObject(res)) {
                console.error(res);
                throw Error(`status ${res.error.code}`);
            }
            if (res.nextPageToken) next_page_token = res.nextPageToken;
            already_posted_events.push(...res.items);
        } while (res.hasOwnProperty("nextPageToken"));
        return already_posted_events;
    }

    async function addEventToGoogleCal(start: string, title: string) {
        if (!(session && session.user)) return;
        const google_api_url = `https://www.googleapis.com/calendar/v3/calendars/${formState.toCalendar}/events`;
        let res = await fetch(google_api_url, {
            method: "POST",
            headers: {Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json"},
            body: JSON.stringify({
                end: {dateTime: getEndTime(start)},
                start: {dateTime: start},
                summary: title,
                description: "#created_by_dp2gc",
            }),
        });
        if (res.status >= 400) {
            res.json().then((data) => {
                console.log(data);
            });
            alert(`${start}???????????????${title}????????????????????????????????????????????????????????????????????????????????????????????????????????????`);
        }
        setImportCount((prevCount) => prevCount + 1);
    }

    // If we sort Event, we can bisect the search by date.
    function isEventDuplicated(already_posted_event_list: Event[], class_event: ClassEvent): boolean {
        for (const already_posted_event of already_posted_event_list) {
            if (!already_posted_event.start.dateTime) {
                continue;
            }
            const is_class_title_same = class_event.title == already_posted_event.summary;
            const is_start_time_same = new Date(class_event.start).toISOString() == new Date(already_posted_event.start.dateTime).toISOString();
            if (is_class_title_same && is_start_time_same) {
                return true;
            }
        }
        return false;
    }

    return (
        <Stack spacing={2} component="form" autoComplete="off" action="/import">
            <FormControl margin="normal">
                <InputLabel id="import-year-label">?????????????????????</InputLabel>
                <Select disabled={appState != "ready"} value={formState.importYear} onChange={handleSelectChange} name="importYear" labelId="import-year-label" label="?????????????????????????????????" margin="dense">
                    {selectableYears.map((selectableYear: number, i: number) => (
                        <MenuItem value={selectableYear} key={i}>
                            {selectableYear}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <ImportRange disabled={appState != "ready"} error={importRangeError} value={formState.importRange} onChange={handleSelectChange} />
            <ToCalendar disabled={appState != "ready"} error={calendarInputError} value={formState.toCalendar} onChange={handleSelectChange} setAccessToken={setAccessToken} />
            <DHUPortalData disabled={appState != "ready"} error={dhuPortalInputError} username={formState.username} password={formState.password} onChange={handleInputChange} />
            <ImportOptions disabled={appState != "ready"} value={formState.ignoreOtherEvents} onChange={handleInputChange} />
            <input type="hidden" name="accessToken" value={accessToken} />
            <br />
            <Button disabled={appState == "unauthenticated" || appState == "connect portal" || appState == "import"} variant="contained" onClick={onImportClick}>
                {appState == "connect portal" ? "?????????????????????????????????????????????..." : ""}
                {appState == "import" ? `(${importCount}???/${totalImportCount}???)` : ""}
                {appState == "unauthenticated" ? "Google????????????????????????????????????????????????" : "???????????????"}
            </Button>
            <AllDeleteButton disabled={appState == "unauthenticated"}></AllDeleteButton>
        </Stack>
    );
}
