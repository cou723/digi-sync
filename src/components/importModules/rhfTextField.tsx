import { TextField } from "@mui/material";
import React from "react";
import { UseFormRegister } from "react-hook-form";

import { FormInputs, GoogleFormInputs } from "@/types/formInputsTypes";

type Props = {
	disabled?: boolean;
	error_message?: string;
	label?: string;
	name: string;
	register: UseFormRegister<FormInputs> | UseFormRegister<GoogleFormInputs>;
	type?: string;
};

export default React.memo(function RhfTextField({
	name,
	type = "text",
	disabled = false,
	register,
	error_message,
	label = "",
}: Props) {
	return (
		<TextField
			disabled={disabled}
			error={!!error_message}
			helperText={error_message}
			id='name'
			label={label}
			required
			type={type}
			variant='standard'
			{...register(name, { required: true })}
		/>
	);
});
