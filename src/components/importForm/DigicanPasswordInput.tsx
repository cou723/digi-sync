import React from "react";

import RhfTextField from "@/components/utils/rhfTextField";

type Props = {
	appState: any;
	errors: any;
	register: any;
};
const DigicanPasswordInput = ({ appState, errors, register }: Props) => {
	return (
		<RhfTextField
			disabled={appState != "ready"}
			error_message={errors.password?.message}
			label='デジキャンのパスワード'
			name='password'
			register={register}
			type='password'
		/>
	);
};

export default DigicanPasswordInput;
