import { Box } from "@mui/material";
import Image from "next/image";
import { useTranslation } from "next-i18next";

import LogoImage from "public/logo.svg";

export default function Logo() {
	const { t } = useTranslation("common");
	return (
		<Box sx={{ display: "block", flexGrow: 1, mr: 2, mt: 1 }}>
			<Image src={LogoImage} alt={t("digi_sync")} height='40' />
		</Box>
	);
}
