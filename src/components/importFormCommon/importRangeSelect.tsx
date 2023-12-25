import React from "react";
import { Control } from "react-hook-form";

import RhfMuiSelect from "@/components/utils/rhfMuiSelect";
import { FormInputs, GoogleFormInputs } from "@/types/formInputsTypes";

type Props = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<FormInputs, any> | Control<GoogleFormInputs, any>;
	disabled?: boolean;
};

const ImportRangeSelect = React.memo(function ImportRangeSelect({
	disabled = false,
	control,
}: Props) {
	return (
		<RhfMuiSelect
			control={control}
			disabled={disabled}
			label='インポートする範囲を選択してください'
			name='importRange'
			options={[
				["1クオーター", "1q"],
				["2クオーター", "2q"],
				["3クオーター", "3q"],
				["4クオーター", "4q"],
				["前期", "1q_and_2q"],
				["後期", "3q_and_4q"],
			].map(([label, value]) => ({ label, value }))}
		/>
	);
});
export default ImportRangeSelect;
