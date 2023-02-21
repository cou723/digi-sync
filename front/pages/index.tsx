import ImportForm from "../components/ImportForm";
import {Container} from "@mui/material";
import HEAD from "../components/Head";
export default function Home() {
    return (
        <>
            <HEAD />
            <Container sx={{pt:2}} maxWidth="sm">
                <ImportForm></ImportForm>
            </Container>
        </>
    );
}
