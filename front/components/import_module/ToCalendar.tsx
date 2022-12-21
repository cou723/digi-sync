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
        if (!session) return;
        fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setCalendars(data.items);
            });
            setAccessToken(session.accessToken);
    }, [session]);

    return (
        <FormControl fullWidth margin="normal">
            <InputLabel id="to-calendar-list-label">インポート先カレンダー</InputLabel>
            <Select onChange={onChange} value={value} required name="toCalendar" labelId="to-calendar-list-label" label="インポート先カレンダー" margin="dense">
                {calendars.map((calendar: Calendar) => (
                    <MenuItem value={calendar.id} key={calendar.id}>
                        {calendar.summary}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ToCalendar;
