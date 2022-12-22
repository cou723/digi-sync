import React, {useState, useEffect, ReactNode} from "react";
import {useSession, signIn, signOut} from "next-auth/react";
import {Select, MenuItem, FormControl, InputLabel, SelectChangeEvent} from "@mui/material";

type Calendar = {
    id: string;
    summary: string;
};

type Props = {
    value: string;
    onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
    setAccessToken: (accessToken: string) => void;
};

const ToCalendar = ({value, onChange, setAccessToken}: Props) => {
    const [calendars, setCalendars] = useState<Array<Calendar>>([{id: "0", summary: "Googleでログインしてください"}]);
    const {data: session} = useSession();

    useEffect(() => {
        (async () => {
            let res: Response;
            try {
                if (!session) return;
                res = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
                    method: "GET",
                    headers: {Authorization: `Bearer ${session.accessToken}`},
                });
            } catch (e) {
                console.error(e);
                return;
            }
            let data = await res.json();
            setCalendars(data.items);
            setAccessToken(session.accessToken);
        })()
    }, [session, setAccessToken]);

    return (
        <FormControl fullWidth margin="normal">
            <InputLabel id="to-calendar-list-label">インポート先カレンダー</InputLabel>
            <Select onChange={onChange} value={value} required name="toCalendar" labelId="to-calendar-list-label" label="インポート先カレンダー" margin="dense">
                {calendars.map((calendar) => (
                    <MenuItem value={calendar.id} key={calendar.id}>
                        {calendar.summary}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ToCalendar;
