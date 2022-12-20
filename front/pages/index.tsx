import Header from "../components/Header";
import ImportRange from "../components/import_module/ImportRange";
import DHUPortalData from "../components/import_module/DHUPortalData";
import ImportOptions from "../components/import_module/ImportOptions";
import Fetch from "../components/import_module/ToCalendar";
import {Container, Box} from "@mui/material";

export default function Home() {
    return (
        <>
            <Header />

            <Container maxWidth="sm">
                <Box component="form">
                    <ImportRange />
                    <Fetch />
                    <DHUPortalData />
                    <ImportOptions />
                </Box>
            </Container>
        </>
    );
}
