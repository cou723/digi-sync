import { useTranslation } from "next-i18next";
import React from "react";
import { Control } from "react-hook-form";

import { getSelectableYearList } from "@/libs/importFormCommons";
import { FormInputs, GoogleFormInputs } from "@/types/formInputsTypes";

import RhfMuiSelect from "./rhfMuiSelect";

type Props = {
	appState: string;
	control: Control<FormInputs, any> | Control<GoogleFormInputs, any>;
};

const ImportYear = React.memo(function ImportYearSelect({
	appState,
	control,
}: Props) {
	const { t } = useTranslation("components");
	const selectableYears = React.useMemo(() => getSelectableYearList(), []);
	return (
		<RhfMuiSelect
			control={control}
			disabled={appState !== "ready"}
			label={t("importModules.ImportYearSelect.label")}
			name='importYear'
			options={selectableYears}
		/>
	);
});
export default ImportYear;
