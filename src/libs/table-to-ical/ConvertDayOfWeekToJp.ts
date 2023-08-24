import { ShortDayOfWeekList } from "./types";

export type ConvertDayOfWeekToJpArgsType = ShortDayOfWeekList;
export type ConvertDayOfWeekToJpReturnType = "月" | "火" | "水" | "木" | "金" | "土";

const ConvertDayOfWeekToJp = (
	Args: ConvertDayOfWeekToJpArgsType,
): ConvertDayOfWeekToJpReturnType => {
	const List = {
		Fri: "金",
		Mon: "月",
		Sat: "土",
		Thu: "木",
		Tue: "火",
		Wed: "水",
	};
	return List[Args] as ConvertDayOfWeekToJpReturnType;
};

export default ConvertDayOfWeekToJp;
