import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import React from "react";

const ColorButton = styled(Button)<ButtonProps>(() => ({
	"&:hover": {
		backgroundColor: "#fff",
		color: "#ff5a00",
	},
	border: "1px solid",
	borderColor: "#fff",
	color: "#fff",
	textTransform: "none",
}));

export default React.memo(function LoginBtn() {
	const { t } = useTranslation("components");
	const { status } = useSession();
	if (status == "authenticated") {
		return (
			<ColorButton sx={{ my: 1 }} color='inherit' onClick={() => signOut()} size='large'>
				{t("HeaderModules.sign_out")}
			</ColorButton>
		);
	}
	return (
		<ColorButton sx={{ my: 1 }} color='inherit' onClick={() => signIn("google")} size='large'>
			{t("HeaderModules.sign_in_with_google")}
		</ColorButton>
	);
});
