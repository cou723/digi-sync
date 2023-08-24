import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";
import { Controller, UseFormRegister } from "react-hook-form";

import { FormInputs, GoogleFormInputs } from "@/types/formInputsTypes";
import { getNowAcademicYear } from "@/libs/utils";

type Props = {
	disabled: boolean;
	options: string[];
	control: any;
	label: string;
	name: string;
};

const ImportYear = React.memo(function ImportYearSelect({
	disabled,
	control,
	options,
	label,
	name,
}: Props) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<FormControl margin='normal'>
					<InputLabel id={label}>{label}</InputLabel>
					<Select
						disabled={disabled}
						labelId={label}
						label={label}
						margin='dense'
						{...field}
					>
						{options.map((option: string, i: number) => (
							<MenuItem value={option} key={i}>
								{option}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			)}
		/>
	);
});
export default ImportYear;
