import dayjs from "dayjs";
import * as yup from "yup";
import { FormInputs } from "../types/formInputsTypes";
import ImportRange from "../types/importRange";
import { RawClassEvent } from "../types/types";
import { getNowAcademicYear } from "./utils";

export const INIT_REQUIRE_VALUE_LIST = ["importRange", "toCalendar", "username", "password"];

export const FORM_STATE_DEFAULT_VALUE: FormInputs = {
    importYear: getNowAcademicYear().toString(),
    importRange: "",
    username: "",
    password: "",
    ignoreOtherEvents: true,
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

export const getSelectableYearList = (): number[] => {
    return new Array<number>(dayjs().year() - 1, dayjs().year(), dayjs().year() + 1);
};

export const FORM_SCHEMA_SHAPE = {
    importYear: yup.number(),
    importRange: yup.string().required("インポートする範囲を選択してください"),
    username: yup.string().required("入力してください"),
    password: yup.string().required("入力してください"),
    ignoreOtherEvents: yup.boolean(),
};
