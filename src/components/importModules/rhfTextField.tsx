import { TextField } from "@mui/material";
import React from "react";
import { UseFormRegister } from "react-hook-form";

import { FormInputs, GoogleFormInputs } from "@/types/formInputsTypes";

type Props = {
	disabled?: boolean;
	error_message?: string;
	label?: string;
	name: string;
	onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
	register: UseFormRegister<FormInputs> | UseFormRegister<GoogleFormInputs>;
	type?: string;
	value: string;
};

export default React.memo(function RhfTextField({
	name,
	type = "text",
	disabled = false,
	register,
	error_message,
	onChange,
	value,
	label = "",
}: Props) {
	return (
		<TextField
			{...register(name, { required: true })}
			disabled={disabled}
			error={!!error_message}
			type={type}
			onChange={onChange}
			value={value}
			required
			name={name}
			id='standard-basic'
			label={label}
			variant='standard'
			helperText={error_message}
		/>
	);
});
