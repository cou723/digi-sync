import React from "react";
import SigninBtns from "../component/SigninBtns";
import {Container} from "@mui/material";
import Header from "../component/Header";
import ImportRange from "../component/ImportRange";
import ToCalendar from "../component/ToCalendar";
import DHUPortalData from "../component/DHUPortalData";
import ImportOptions from "../component/ImportOptions";
import ApiCalendar from "react-google-calendar-api";

const BaseUrl = "https://www.googleapis.com/calendar/v3";

const CLIENT_ID = "822488502520-6hbn6f2emi5kgnqqj0acesk396gmuhak.apps.googleusercontent.com";
const API_KEY = "AIzaSyC_fWzofzRcMFwZZ4YUJmF1g8Hrc8m-rO8";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar";

const config = {
    clientId: "822488502520-u0cv3d11emdejo5o4duom4etrr3a9f0s.apps.googleusercontent.com",
    apiKey: "AIzaSyC_fWzofzRcMFwZZ4YUJmF1g8Hrc8m-rO8",
    scope: "https://www.googleapis.com/auth/calendar",
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
};

export default function Home() {
    const apiCalendar = new ApiCalendar(config);
    return (
        <div>
            <Header />
            <Container>
                <ImportRange />
                <ToCalendar apiCalendar={apiCalendar} />
                <DHUPortalData />
                <ImportOptions />
            </Container>
        </div>
    );
}
