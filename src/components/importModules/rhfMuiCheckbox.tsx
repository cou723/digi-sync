import { FormControlLabel, Checkbox } from "@mui/material";
import React from "react";
import { Control, Controller } from "react-hook-form";


type Props = {
	control: Control<any, any>;
	disabled?: boolean;
	label: string;
	name: string;
	rules?: any;
};

export const RhfMuiCheckbox = React.memo(function RhfMuiCheckbox({
	control,
	label,
	name,
	rules,
	disabled = false,
}: Props) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<FormControlLabel
					control={<Checkbox {...field} checked={!!field.value} />}
					disabled={disabled}
					label={label}
				/>
			)}
			rules={rules}
		/>
	);
});
