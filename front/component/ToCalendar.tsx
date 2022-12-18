import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ApiCalendar from "react-google-calendar-api";
import SigninBtns from "./SigninBtns";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useState} from "react";

export default function ToCalendar({apiCalendar}: {apiCalendar: ApiCalendar}) {
    let [res, setRes] = useState(null);
    let [isSignedIn, setIsSignedIn] = useState(apiCalendar.sign);
    apiCalendar.onLoadCallback = () => {
        apiCalendar.tokenClient.callback = (isSigned: boolean) => {
            setIsSignedIn(isSigned);
        };
    };
    if (!isSignedIn) return <SigninBtns apiCalendar={apiCalendar}></SigninBtns>;
    setRes(apiCalendar.listCalendars()).then((res) => {
        console.log(res);
        setIsLoading(false);
        return (
            <Select>
                {res.result.items.map((calendar: any) => {
                    return (
                        <MenuItem value={calendar.id} key={calendar.id}>
                            {calendar.summary}
                        </MenuItem>
                    );
                })}
            </Select>
        );
    });
    return (
        <p>dummy</p>
    )
}
