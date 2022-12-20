import Head from "next/head";
import Image from "next/image";
import {Inter} from "@next/font/google";
import styles from "../styles/Home.module.css";
import LoginBtn from "../components/LoginBtn";
import Header from "../components/Header";
import ImportRange from "../components/ImportRange";
import DHUPortalData from "../components/DHUPortalData";
import ImportOptions from "../components/ImportOptions";
import {Container} from "@mui/material";
import Fetch from "../components/Fetch";

const inter = Inter({subsets: ["latin"]});

export default function Home() {
    return (
        <>
            <Header />

            <Container maxWidth="sm">
                <ImportRange />
                <Fetch />
                <DHUPortalData />
                <ImportOptions />
            </Container>
        </>
    );
}
