import React from "react";

import RhfTextField from "@/components/utils/rhfTextField";

type Props = {
	appState: any;
	errors: any;
	register: any;
};

function DigicanUsernameInput({ appState, errors, register }: Props) {
	return (
		<RhfTextField
			disabled={appState != "ready"}
			error_message={errors.username?.message}
			label='デジキャンのユーザーネーム(学籍番号)'
			name='username'
			register={register}
		/>
	);
}

export default DigicanUsernameInput;
