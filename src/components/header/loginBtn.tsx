import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { signIn, signOut } from "next-auth/react";
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
	const { authStatus } = useCustomSession();

	// TODO: 三項演算子で条件分岐したい
	if (authStatus == "authenticated") {
		return (
			<ColorButton color='inherit' onClick={() => signOut()} size='large' sx={{ my: 1 }}>
				ログアウト
			</ColorButton>
		);
	}
	return (
		<ColorButton color='inherit' onClick={() => signIn("google")} size='large' sx={{ my: 1 }}>
			Googleでログイン
		</ColorButton>
	);
});
