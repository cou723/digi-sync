import { Checkbox, FormControlLabel } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";
import { UseFormRegister } from "react-hook-form";

import { FormInputs, GoogleFormInputs } from "types/formInputsTypes";

type Props = {
	disabled?: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
	register: UseFormRegister<FormInputs> | UseFormRegister<GoogleFormInputs>;
	value: boolean;
};

const ImportOptions = React.memo(function ImportOptions({
	register,
	disabled = false,
	value,
	onChange,
}: Props) {
	const { t } = useTranslation("components");
	return (
		<FormControlLabel
			disabled={disabled}
			control={
				<Checkbox
					{...register("ignoreOtherEvents")}
					value={value}
					onChange={onChange}
					required
					name='ignoreOtherEvents'
					defaultChecked
				/>
			}
			label={t("importModules.ImportOptions.label")}
		/>
	);
});

export default ImportOptions;
