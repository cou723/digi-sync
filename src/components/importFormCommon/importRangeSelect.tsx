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
				t("importModules.ImportRangeSelect.first_quarter"),
				t("importModules.ImportRangeSelect.second_quarter"),
				t("importModules.ImportRangeSelect.third_quarter"),
				t("importModules.ImportRangeSelect.fourth_quarter"),
				cc("first_semester"),
				cc("second_semester"),
			]}
		/>
	);
});
export default ImportRangeSelect;
