import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { signIn, signOut } from "next-auth/react";
import { useTranslation } from "next-i18next";
import React from "react";

import { useCustomSession } from "@/hooks/useCustomSession";

// eslint-disable-next-line @typescript-eslint/naming-convention
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
	const { authStatus } = useCustomSession();
	if (authStatus == "authenticated") {
		return (
			<ColorButton color='inherit' onClick={() => signOut()} size='large' sx={{ my: 1 }}>
				{t("HeaderModules.sign_out")}
			</ColorButton>
		);
	}
	return (
		<ColorButton color='inherit' onClick={() => signIn("google")} size='large' sx={{ my: 1 }}>
			{t("HeaderModules.sign_in_with_google")}
		</ColorButton>
	);
});
