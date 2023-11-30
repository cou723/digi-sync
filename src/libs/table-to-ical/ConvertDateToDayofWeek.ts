import { dayjsWrapper } from "./dayjs";

export type ConvertDateToDayOfWeekArgsType = string;
export type ConvertDateToDayOfWeekReturnType = number;
/*
 * 日付を入力したら曜日を返す
 * 返す曜日は数字
 * 例 日曜日 -> 0
 * 例 月曜日 -> 1
 *  土曜日 -> 6
 * **/
const ConvertDateToDayOfWeek = (
	Args: ConvertDateToDayOfWeekArgsType,
): ConvertDateToDayOfWeekReturnType => {
	return dayjsWrapper(Args).day();
};

export default ConvertDateToDayOfWeek;
