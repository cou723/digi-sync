import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Header from "../component/Header";
import ImportForm from "../component/ImportForm";
import Typography from "@mui/material/Typography";
import React, {useState, useEffect} from "react";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {GoogleLogin, CredentialResponse} from "@react-oauth/google";
import axios from "axios";
import {Button} from "@mui/material";
import CodeFlow from "../component/CodeFlow";
const BaseUrl = "https://www.googleapis.com/calendar/v3";

const CLIENT_ID = "822488502520-6hbn6f2emi5kgnqqj0acesk396gmuhak.apps.googleusercontent.com";
const API_KEY = "AIzaSyC_fWzofzRcMFwZZ4YUJmF1g8Hrc8m-rO8";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar";

type Calender = {
    id: string;
    name: string;
};

type CalendarList = {
    calenders: Calender[];
};

export default function Home() {
    const [credentialResponse, setCredentialResponse] = useState<CredentialResponse | null>();

    // useEffect(() => {
    //     const setFirstTaskList = async (accessToken: string) => {
    //         const calenders = await loadCalendarList(accessToken);
    //         console.log(calenders);

    //         setCalendarList({calenders: calenders} as CalendarList);
    //     };
    //     if (accessToken) {
    //         setFirstTaskList(accessToken);
    //     }
    // }, [accessToken]);

    const loadCalendarList = async (accessToken: string) => {
        const res = await axios.get<any>(`${BaseUrl}/users/me/calendarList`, {
            headers: {Authorization: `Bearer ${accessToken}`},
        });
        return res.data.items;
    };
    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    setCredentialResponse(credentialResponse);
                }}
                onError={() => {
                    console.log("Login Failed");
                }}
            />
            <h1>calendar list</h1>
            {/* {CalendarList?.calenders.map((calender) => (
                <li key={calender.id}>{calender.name}</li>
            ))} */}
        </GoogleOAuthProvider>
    );
}
