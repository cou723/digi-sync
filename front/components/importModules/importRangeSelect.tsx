import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { ReactNode } from "react";
import { UseFormRegister } from "react-hook-form";

import { FormInputs, GoogleFormInputs } from "types/formInputsTypes";

type Props = {
	disabled?: boolean;
	errorMessage: string;
	onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
	register: UseFormRegister<FormInputs> | UseFormRegister<GoogleFormInputs>;
	value: string;
};

const ImportRangeSelect = React.memo(function ImportRangeSelect({
	register,
	disabled = false,
	errorMessage,
	value,
	onChange,
}: Props) {
	const { t } = useTranslation("components");
	const { t: cc } = useTranslation("common");
	return (
		<FormControl fullWidth margin='normal'>
			<InputLabel id='import-q-label'>
				{t("importModules.ImportRangeSelect.label")}
			</InputLabel>
			<Select
				{...register("importRange")}
				disabled={disabled}
				error={!!errorMessage}
				onChange={onChange}
				value={value}
				required
				name='importRange'
				labelId='import-q-label'
				label={t("importModules.ImportRangeSelect.label")}
				margin='dense'
			>
				<MenuItem value='1q'>{t("importModules.ImportRangeSelect.first_quarter")}</MenuItem>
				<MenuItem value='2q'>
					{t("importModules.ImportRangeSelect.second_quarter")}
				</MenuItem>
				<MenuItem value='3q'>{t("importModules.ImportRangeSelect.third_quarter")}</MenuItem>
				<MenuItem value='4q'>
					{t("importModules.ImportRangeSelect.fourth_quarter")}
				</MenuItem>
				<MenuItem value='1q_and_2q'>{cc("first_semester")}</MenuItem>
				<MenuItem value='3q_and_4q'>{cc("second_semester")}</MenuItem>
			</Select>
			<FormHelperText>{errorMessage}</FormHelperText>
		</FormControl>
	);
});
export default ImportRangeSelect;
