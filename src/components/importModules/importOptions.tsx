import { useTranslation } from "next-i18next";
import React from "react";
import { Control, UseFormRegister } from "react-hook-form";

import { FormInputs, GoogleFormInputs } from "@/types/formInputsTypes";

import { RhfMuiCheckbox } from "./rhfMuiCheckbox";

type Props = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<FormInputs, any> | Control<GoogleFormInputs, any>;
	disabled?: boolean;
	register: UseFormRegister<FormInputs> | UseFormRegister<GoogleFormInputs>;
};

const ImportOptions = React.memo(function ImportOptions({ control, disabled = false }: Props) {
	const { t } = useTranslation("components");
	return (
		<RhfMuiCheckbox
			control={control}
			disabled={disabled}
			label={t("importModules.ImportOptions.label")}
			name='ignoreOtherEvents'
		/>
	);
});

export default ImportOptions;
