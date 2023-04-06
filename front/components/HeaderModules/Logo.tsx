import { Box } from "@mui/material";
import Image from "next/image";
import LogoImage from "public/logo.svg";

export default function Logo() {
  return (
    <Box sx={{ mt: 1, display: "block", mr: 2, flexGrow: 1 }}>
      <Image src={LogoImage} alt="デジシンク" height="40" />
    </Box>
  );
}
