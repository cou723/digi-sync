import dayjs from "dayjs";
import * as yup from "yup";

import { FormInputs } from "@/types/formInputsTypes";
import ImportRange from "@/types/importRange";
import { RawClassEvent } from "@/types/types";

import { getNowAcademicYear } from "./utils";

export const INIT_REQUIRE_VALUE_LIST = ["importRange", "toCalendar", "username", "password"];

export const FORM_STATE_DEFAULT_VALUE: FormInputs = {
	ignoreOtherEvents: true,
	importRange: "",
	importYear: getNowAcademicYear().toString(),
	password: "",
	username: "",
} as FormInputs;

export function excludeOutOfImportRange(
	formState: FormInputs,
	class_events: RawClassEvent[],
): RawClassEvent[] {
	const { start, end } = new ImportRange(formState.importRange).getQuarterRange(
		parseInt(formState.importYear),
	);

	const start_unix = start.unix();
	const end_unix = end.unix();

	return class_events.filter((class_event) => {
		const start_date = dayjs(class_event.start).unix();
		return start_date > start_unix && start_date < end_unix;
	});
}

export const getSelectableYearList = (): string[] => {
	return new Array<number>(dayjs().year() - 1, dayjs().year(), dayjs().year() + 1).map((year) =>
		year.toString(),
	);
};

export const FORM_SCHEMA_SHAPE = {
	ignoreOtherEvents: yup.boolean().required("入力してください"),
	importRange: yup.string().required("インポートする範囲を選択してください"),
	importYear: yup.string().required("インポート年度を選択してください"),
	password: yup.string().required("入力してください"),
	username: yup.string().required("入力してください"),
};
