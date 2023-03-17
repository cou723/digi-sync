import { Container, Alert, Fade } from "@mui/material";
import HEAD from "../components/Head";
import { useSession } from "next-auth/react";
import { ImportIcalForm } from "../components/ImportIcalForm";

export default function Home() {
  const { data: session, status: authStatus } = useSession();
  return (
    <>
      <HEAD />
      <Container sx={{ pt: 2 }} maxWidth="sm">
        <ImportIcalForm />
      </Container>
    </>
  );
}
