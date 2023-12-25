import { Button } from "@mui/material";
import React from "react";

import { ImportFormState } from "@/components/importForm";

function getLabel(appState: ImportFormState): string {
	switch (appState) {
		case "unauthenticated":
			return "グーグルアカウントにログインしてください";
		case "import":
		case "connect portal":
			return "インポート中";
		default:
			return "Googleカレンダーへインポート";
	}
}

type Props = { appState: ImportFormState; onClick: () => void };

const ExecuteButton = ({ appState, onClick }: Props) => {
	return (
		<Button
			disabled={appState !== "ready"}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onClick={onClick}
			sx={{ textTransform: "none" }}
			type='submit'
			variant='contained'
		>
			{getLabel(appState)}
		</Button>
	);
};

export default ExecuteButton;
