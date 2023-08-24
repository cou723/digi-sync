import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import React from "react";
import { Controller} from "react-hook-form";


type Props = {
	control: any;
	disabled: boolean;
	label: string;
	name: string;
	options: string[];
};

const RhfMuiSelect = React.memo(function RhfMuiSelect({
	disabled,
	control,
	options,
	label,
	name,
}: Props) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field, fieldState }) => (
				<FormControl margin='normal'>
					<InputLabel id={label}>{label}</InputLabel>
					<Select
						disabled={disabled}
						error={!!fieldState.error?.message}
						label={label}
						labelId={label}
						margin='dense'
						{...field}
					>
						{options.map((option: string, i: number) => (
							<MenuItem key={i} value={option}>
								{option}
							</MenuItem>
						))}
					</Select>
					<FormHelperText>{fieldState.error?.message}</FormHelperText>
				</FormControl>
			)}
		/>
	);
});
export default RhfMuiSelect;
