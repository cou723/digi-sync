import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";
import { UseFormRegister } from "react-hook-form";
import { FormInputs, GoogleFormInputs } from "types/formInputsTypes";

type Props = {
	register: UseFormRegister<FormInputs> | UseFormRegister<GoogleFormInputs>;
	appState: string;
	value: string;
	onChange: (event: SelectChangeEvent<string>) => void;
	selectableYears: number[];
};

const ImportYear = React.memo(function ImportYearSelect({
	register,
	appState,
	value,
	onChange,
	selectableYears,
}: Props) {
	const { t } = useTranslation("components");
	return (
		<FormControl margin='normal'>
			<InputLabel id='import-year-label'>
				{t("importModules.ImportYearSelect.label")}
			</InputLabel>
			<Select
				{...register("importYear", { required: true, valueAsNumber: true })}
				disabled={appState != "ready"}
				value={value}
				onChange={onChange}
				name='importYear'
				labelId='import-year-label'
				label={t("importModules.ImportYearSelect.label")}
				margin='dense'
			>
				{selectableYears.map((selectableYear: number, i: number) => (
					<MenuItem value={selectableYear} key={i}>
						{selectableYear}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
});
export default ImportYear;
