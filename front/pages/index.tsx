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

scoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
};

export default function Home() {
    return (
        <div>
            <Header />
            <Container>
                <ImportRange />
                <ToCalendar/>
                <DHUPortalData />
                <ImportOptions />
            </Container>
        </div>
    );
}
