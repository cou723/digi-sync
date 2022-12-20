import React, {useState, useEffect} from "react";
import {useSession, signIn, signOut} from "next-auth/react";
import {Select, MenuItem, FormControl, InputLabel} from "@mui/material";

type Calendar = {
    id: string;
    summary: string;
};

const Fetch = () => {
    const [calendars, setCalendars] = useState<Array<Calendar>>([{id: "0", summury: "Googleでログインしてください"}]);
    const {data: session} = useSession();

    useEffect(() => {z
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
    }, [session]);

    return (
        <FormControl fullWidth>
            <InputLabel id="to-calendar-list-label">to calendar</InputLabel>
            <Select labelId="to-calendar-list-label" label="to calendar" margin="dense">
                {calendars.map((calendar: Calendar) => (
                    <MenuItem value={calendar.summary} key={calendar.id}>
                        {calendar.summary}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default Fetch;
