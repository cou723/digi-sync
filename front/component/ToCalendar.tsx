import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import ApiCalendar from "react-google-calendar-api";
import SigninBtns from "./SigninBtns";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function ToCalendar({apiCalendar}: {apiCalendar: ApiCalendar}) {
    if (!apiCalendar.sign) return <SigninBtns apiCalendar={apiCalendar}></SigninBtns>;
    return (
        <Select>
            {apiCalendar.listCalendars().map((calendar: any) => {
                return (
                    <MenuItem value={calendar.id} key={calendar.id}>
                        {calendar.summary}
                    </MenuItem>
                );
            })}
        </Select>
    );
}
