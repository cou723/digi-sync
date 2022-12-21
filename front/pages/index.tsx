import Header from "../components/Header";
import ImportRange from "../components/import_module/ImportRange";
import DHUPortalData from "../components/import_module/DHUPortalData";
import ImportOptions from "../components/import_module/ImportOptions";
import ToCalendar from "../components/import_module/ToCalendar";
import {Container, Button, Stack, SelectChangeEvent} from "@mui/material";
import {useState, ChangeEvent, ReactNode} from "react";

type Inputs = {
    importRange: string;
    username: string;
    password: string;
    ignoreOtherEvent: boolean;
    toCalendar: string;
};

export default function Home() {
    let [state, setState] = useState<Inputs>({importRange: "", username: "", password: "", ignoreOtherEvent: true, toCalendar: ""} as Inputs);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setState({
            ...state,
            [event.target.name]: value,
        });
        console.log(state);
    };
    const handleSelectChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
        const value = event.target.value;
        setState({
            ...state,
            [event.target.name]: value,
        });
        console.log(state);
    };
    const handleSubmit = () => {
        console.log("submit");
    };
    return (
        <>
            <Header />

            <Container maxWidth="sm">
                <Stack spacing={2} component="form" onSubmit={handleSubmit} autoComplete="off" action="">
                    <ImportRange value={state.importRange} onChange={handleSelectChange} />
                    <ToCalendar value={state.toCalendar} onChange={handleSelectChange} />
                    <DHUPortalData username={state.username} password={state.password} onChange={handleInputChange} />
                    <ImportOptions value={state.ignoreOtherEvent} onChange={handleInputChange} />
                    <Button variant="contained" type="submit">
                        インポート
                    </Button>
                </Stack>
            </Container>
        </>
    );
}
