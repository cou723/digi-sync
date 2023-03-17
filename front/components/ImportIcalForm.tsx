import Reacrt from "react";
import ImportRange from "./ImportModules/ImportRange";
import DHUPortalData from "./ImportModules/DHUPortalData";
import ImportOptions from "./ImportModules/ImportOptions";
import ToCalendar from "./ImportModules/ToCalendar";
import AllDeleteButton from "./ImportModules/AllDeleteButton";
import { Button, Stack, SelectChangeEvent, Select, InputLabel, FormControl, MenuItem } from "@mui/material";
import { useState, useEffect, ChangeEvent, ReactNode } from "react";
import { useSession } from "next-auth/react";
import type { CalendarList, Event } from "../types/gapi_calendar";
import { encodeQueryData, getEndTime, getQuarterRange, isGetEventErrorObject, GetEventsErrorObject } from "../libs/utils";
import { Inputs, ClassEvent } from "../types/types";
import { DownloadBrowsser } from "../libs/table-to-ical/DownloadBrowser";
import { ConvertToIcalMap } from "../libs/table-to-ical/ConvertToIcal";

const FORM_STATE_INIT_VALUE: Inputs = {
    importYear: (new Date().getFullYear() - 1).toString(),
    importRange: "",
    toCalendar: "",
    username: "",
    password: "",
    ignoreOtherEvents: true,
} as Inputs;

interface Event {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    editable: boolean;
    className: string;
}

export interface API_RETURN_EventList {
    events: Event[];
}
const INIT_REQUIRE_VALUE_LIST = ["importRange", "toCalendar", "username", "password"];

export function ImportIcalForm() {
    let [formState, setFormState] = useState<Inputs>(FORM_STATE_INIT_VALUE);
    let [accessToken, setAccessToken] = useState<string>("");
    let [importCount, setImportCount] = useState<number>(0);

    let [importRangeError, setImportRangeError] = useState<string>("");
    let [calendarInputError, setCalendarInputError] = useState<string>("");
    let [dhuPortalInputError, setDhuPortalInputError] = useState({ username: "", password: "" });

    let [appState, setAppState] = useState<"unauthenticated" | "ready" | "connect portal" | "import">("unauthenticated");

    let selectableYears: Array<number> = new Array<number>(new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1);

    useEffect(() => {
        if (appState == "import") {
            window.onbeforeunload = function() {
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
        console.log("dataonImportClick ")
        resetErrorMessage();
        // if (existsStateEmpty()) {
        //   setErrorMessages();
        //   return;
        // }

        let data;
        try {

            data = await getEventList();
            console.log("data ", data)
            const IcalTimeTable: any = ConvertToIcalMap(data.events);
            if (IcalTimeTable != null) {
                DownloadBrowsser(IcalTimeTable);
                return;
            }
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
        // await postToGoogleCalendar(class_events);
        setAppState("ready");
    };

    // function existsStateEmpty() {
    //   for (let input_label of Object.keys(formState)) {
    //     if (INIT_REQUIRE_VALUE_LIST.includes(input_label) && FORM_STATE_INIT_VALUE[input_label] == formState[input_label]) return true;
    //   }
    //   return false;
    // }

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
            const fetchValue = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/get_dhu_event_list?" + query_param_str, { method: "GET" });
            res = await fetchValue.json();
        } catch {
            throw new Error("サーバーに接続できませんでした");
        }
        if (res.status_code == "401" && res.detail == "user id or password is invalid") throw new Error("ユーザー名またはパスワードが違います");
        return res;
    };

    function resetErrorMessage() {
        setImportRangeError(FORM_STATE_INIT_VALUE.importRange);
        setCalendarInputError(FORM_STATE_INIT_VALUE.toCalendar);
        setDhuPortalInputError({ username: FORM_STATE_INIT_VALUE.username, password: FORM_STATE_INIT_VALUE.password });
    }

    function setErrorMessages() {
        if (formState.importRange == FORM_STATE_INIT_VALUE.importRange) {
            setImportRangeError("インポート範囲が指定されていません");
        }
        if (formState.toCalendar == FORM_STATE_INIT_VALUE.toCalendar) {
            setCalendarInputError("インポート先のカレンダーが指定されていません");
        }
        let username_error_msg = "";
        if (formState.username == FORM_STATE_INIT_VALUE.username) {
            username_error_msg = "ユーザー名を入力してください";
        }
        let password_error_msg = "";
        if (formState.password == FORM_STATE_INIT_VALUE.password) {
            password_error_msg = "パスワードを入力してください";
        }
        setDhuPortalInputError({ username: username_error_msg, password: password_error_msg });
    }

    function excludeOutOfImportRange(class_events: ClassEvent[]): ClassEvent[] {
        let { start: start_date, end: end_date } = getQuarterRange(parseInt(formState.importYear), formState.importRange);
        let start = start_date.getTime();
        let end = end_date.getTime();
        return class_events.filter((class_event) => {
            let start_date = new Date(class_event.start).getTime();
            return start_date > start && start_date < end;
        });
    }



    return (
        <Stack spacing={2} component="form" autoComplete="off" action="/import">
            <FormControl margin="normal">
                <InputLabel id="import-year-label">インポート年度</InputLabel>
                <Select value={formState.importYear} onChange={handleSelectChange} name="importYear" labelId="import-year-label" margin="dense">
                    {selectableYears.map((selectableYear: number, i: number) => (
                        <MenuItem value={selectableYear} key={i}>
                            {selectableYear}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <ImportRange disabled={false} error={importRangeError} value={formState.importRange} onChange={handleSelectChange} />
            <DHUPortalData disabled={false} error={dhuPortalInputError} username={formState.username} password={formState.password} onChange={handleInputChange} />
            <ImportOptions disabled={false} value={formState.ignoreOtherEvents} onChange={handleInputChange} />
            <input type="hidden" name="accessToken" value={accessToken} />
            <br />
            <Button disabled={appState == "connect portal" || appState == "import"} variant="contained" onClick={onImportClick}>
                {appState == "connect portal" ? "デジキャンから読み込んでいます..." : "インポート"}
            </Button>

        </Stack>
    );
}
