import ImportForm from "../components/ImportForm";
import {Container} from "@mui/material";
import _Head from "../components/Head";
export default function Home() {
    return (
        <>
            <_Head />
            <Container maxWidth="sm">
                <ImportForm></ImportForm>
            </Container>
        </>
    );
}
