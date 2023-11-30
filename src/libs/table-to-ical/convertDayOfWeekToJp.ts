import { ShortDayOfWeekEn, ShortDayOfWeekJp } from "./types";

const convertDayOfWeekToJp = (dayOfWeek: ShortDayOfWeekEn): ShortDayOfWeekJp => {
	const jpDayOfWeekList: { [key: string]: ShortDayOfWeekJp } = {
		Fri: "金",
		Mon: "月",
		Sat: "土",
		Thu: "木",
		Tue: "火",
		Wed: "水",
	};
	return jpDayOfWeekList[dayOfWeek];
};

export default convertDayOfWeekToJp;
