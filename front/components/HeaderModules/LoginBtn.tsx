import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";

const ColorButton = styled(Button)<ButtonProps>(() => ({
    textTransform: "none",
    color: "#fff",
    border: "1px solid",
    borderColor: "#fff",
    "&:hover": {
        color: "#ff5a00",
        backgroundColor: "#fff",
    },
}));

export default function LoginBtn() {
    const { t } = useTranslation("common");
    const { status } = useSession();
    if (status == "authenticated") {
        return (
            <ColorButton sx={{ my: 1 }} color='inherit' onClick={() => signOut()} size='large'>
                {t("components.HeaderModules.sign_out")}
            </ColorButton>
        );
    }
    return (
        <ColorButton sx={{ my: 1 }} color='inherit' onClick={() => signIn("google")} size='large'>
            {t("components.HeaderModules.sign_in_with_google")}
        </ColorButton>
    );
}
