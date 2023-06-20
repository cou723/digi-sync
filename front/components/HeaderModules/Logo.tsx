import { Box } from "@mui/material";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import LogoImage from "public/logo.svg";

export default function Logo() {
    const { t } = useTranslation();
    return (
        <Box sx={{ mt: 1, display: "block", mr: 2, flexGrow: 1 }}>
            <Image src={LogoImage} alt={t("common.digi_sync")} height='40' />
        </Box>
    );
}
