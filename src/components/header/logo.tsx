import { Box } from "@mui/material";
import Image from "next/image";

import LogoImage from "@public/logo.svg";

export default function Logo() {
	return (
		<Box sx={{ display: "block", flexGrow: 1, mr: 2, mt: 1 }}>
			<Image alt='DigiSync' height='40' src={LogoImage} />
		</Box>
	);
}
