import { Button } from "@mui/material";
import React from "react";

import { ImportFormState } from "@/components/importForm";

function getLabel(appState: ImportFormState, IsIcal?: boolean): string {
	switch (appState) {
		case "unauthenticated":
			return "グーグルアカウントにログインしてください";
		case "import":
		case "connect portal":
			return "インポート中";
		default:
			return IsIcal ? "Icalファイルをダウンロード" : "Googleカレンダーへインポート";
	}
}

type Props = {
	IsIcal?: boolean;
	appState: ImportFormState;
	onClick: () => void;
};

const ExecuteButton = ({ appState, onClick, IsIcal }: Props) => {
	return (
		<Button
			disabled={appState !== "ready"}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onClick={onClick}
			sx={{ textTransform: "none" }}
			type='submit'
			variant='contained'
		>
			{getLabel(appState, IsIcal)}
		</Button>
	);
};

export default ExecuteButton;
