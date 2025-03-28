// TODO: これも分けすぎ？
// TODO: でもgoogle calendarでもical出も使っているので、共通化は正解なのかな。たぶんgoogle calendarとicalに関してはもうちょっと設計を見直した方がいい気がする
import React from "react";
import { Control, UseFormRegister } from "react-hook-form";

import { RhfMuiCheckbox } from "@/components/utils/rhfMuiCheckbox";
import { FormInputs, GoogleFormInputs } from "@/types/formInputsTypes";

type Props = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<FormInputs, any> | Control<GoogleFormInputs, any>;
	disabled?: boolean;
	register: UseFormRegister<FormInputs> | UseFormRegister<GoogleFormInputs>;
};

const ImportOptions = React.memo(function ImportOptions({ control, disabled = false }: Props) {
	return (
		<RhfMuiCheckbox
			control={control}
			disabled={disabled}
			label='授業のみインポートする'
			name='ignoreOtherEvents'
		/>
	);
});

export default ImportOptions;
