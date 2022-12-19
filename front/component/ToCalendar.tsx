import {useState, useEffect} from "react";
const {google} = require("googleapis");
const calendar = google.calendar("v3");

import React from "react";

const CLIENT_ID = "822488502520-u0cv3d11emdejo5o4duom4etrr3a9f0s.apps.googleusercontent.com",;
const API_KEY = "AIzaSyC_fWzofzRcMFwZZ4YUJmF1g8Hrc8m-rO8";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar";

const config = {
    clientId: "822488502520-u0cv3d11emdejo5o4duom4etrr3a9f0s.apps.googleusercontent.com",
    apiKey: "AIzaSyC_fWzofzRcMFwZZ4YUJmF1g8Hrc8m-rO8",
    scope: "https://www.googleapis.com/auth/calendar",
};

const ToCalendar = () => {
    const [calendars, setCalendars] = useState([]);

    useEffect(() => {
        async function fetchCalendars() {
            const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, YOUR_CLIENT_SECRET, YOUR_REDIRECT_URL);

            // Set the correct scopes
            oAuth2Client.setCredentials({
                refresh_token: YOUR_REFRESH_TOKEN,
            });

            const calendarList = await calendar.calendarList.list({auth});
            setCalendars(calendarList.data.items);
        }

        fetchCalendars();
    }, []);

    return (
        <div>
            <h1>Calendar List</h1>
            {calendars.map((calendar) => (
                <div key={calendar.id}>
                    <h2>{calendar.summary}</h2>
                    <p>{calendar.description}</p>
                </div>
            ))}
        </div>
    );
};

export default ToCalendar;
