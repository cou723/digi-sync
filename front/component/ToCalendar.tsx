import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ApiCalendar from "react-google-calendar-api";
import SigninBtns from "./SigninBtns";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useState, useEffect} from "react";

export default function ToCalendar({apiCalendar}: {apiCalendar: ApiCalendar}) {
    let [calendarList, setCalendarList] = useState<any>();
    let [isSignedIn, setIsSignedIn] = useState(apiCalendar.sign);

    apiCalendar.onLoadCallback = () => {
        console.log("loading");
        apiCalendar.tokenClient.callback = (isSigned: boolean) => {
            setIsSignedIn(isSigned);
        };
        console.log("set use effect");
        useEffect(() => {
            async function fetchData() {
                console.log("fetch");
                let response = await apiCalendar.listCalendars();
                setCalendarList(response.result.item);
            }
            fetchData();
        }, []);
    };

    if (!isSignedIn) return <SigninBtns apiCalendar={apiCalendar}></SigninBtns>;
    else
        return (
            <FormControl>
                <FormLabel>読み込むカレンダー</FormLabel>
                <Select>
                    {calendarList ? (
                        calendarList.map((calendar: any) => {
                            return (
                                <MenuItem value={calendar.id} key={calendar.id}>
                                    {calendar.summary}
                                </MenuItem>
                            );
                        })
                    ) : (
                        <p>is loading</p>
                    )}
                </Select>
            </FormControl>
        );
}
