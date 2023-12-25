import React from "react";
import { Control } from "react-hook-form";

import RhfMuiSelect from "@/components/utils/rhfMuiSelect";
import { getSelectableYearList } from "@/libs/importFormCommons";
import { FormInputs, GoogleFormInputs } from "@/types/formInputsTypes";

type Props = {
	appState: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<FormInputs, any> | Control<GoogleFormInputs, any>;
};

const ImportYear = React.memo(function ImportYearSelect({ appState, control }: Props) {
	const selectableYears = React.useMemo(() => getSelectableYearList(), []);
	return (
		<RhfMuiSelect
			control={control}
			disabled={appState !== "ready"}
			label='インポートする年度を選択してください'
			name='importYear'
			options={selectableYears.map((year) => ({ label: year, value: year }))}
		/>
	);
});
export default ImportYear;
