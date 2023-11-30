import { ShortDayOfWeekEn } from "./types";

/**
 * 曜日を入力するとそれに対応した曜日を数字で返す
 */

const convertDayOfWeekToNumber = (weekOfDay: ShortDayOfWeekEn): number => {
	const weekOfDayList: { [key: string]: number } = {
		Fri: 5,
		Mon: 1,
		Sat: 6,
		Thu: 4,
		Tue: 2,
		Wed: 3,
	};
	return weekOfDayList[weekOfDay] || 0;
};

export default convertDayOfWeekToNumber;
