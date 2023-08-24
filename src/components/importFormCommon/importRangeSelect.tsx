import { useTranslation } from "next-i18next";
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
	const { t } = useTranslation("components");
	const { t: cc } = useTranslation("common");
	return (
		<RhfMuiSelect
			control={control}
			disabled={disabled}
			label={t("importModules.ImportRangeSelect.label")}
			name='importRange'
			options={[
				[t("importModules.ImportRangeSelect.first_quarter"), "1q"],
				[t("importModules.ImportRangeSelect.second_quarter"), "2q"],
				[t("importModules.ImportRangeSelect.third_quarter"), "3q"],
				[t("importModules.ImportRangeSelect.fourth_quarter"), "4q"],
				[cc("first_semester"), "1q_and_2q"],
				[cc("second_semester"), "3q_and_4q"],
			].map(([label, value]) => ({ label, value }))}
		/>
	);
});
export default ImportRangeSelect;
