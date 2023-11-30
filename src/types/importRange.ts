import dayjs, { Dayjs } from "dayjs";

import { Range } from "./types";
export type ImportRangeString = "1q" | "2q" | "3q" | "4q" | "1q_and_2q" | "3q_and_4q";

export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

const PERIOD_START_MONTH = 4;

export type YearMonth = {
	month: Month;
	year: number;
};

export default class ImportRange {
	range: ImportRangeString;
	static _1q_list: Month[] = [4, 5, 6];
	static _2q_list: Month[] = [6, 7, 8];
	static _3q_list: Month[] = [9, 10, 11];
	static _4q_list: Month[] = [11, 12, 1, 2, 3];

	constructor(range: string) {
		if (!this.isImportRangeString(range)) throw new Error("Invalid range");
		this.range = range;
	}

	isImportRangeString(value: string): value is ImportRangeString {
		return (
			value === "1q" ||
			value === "2q" ||
			value === "3q" ||
			value === "4q" ||
			value === "1q_and_2q" ||
			value === "3q_and_4q"
		);
	}

	getYearMonthList(year: number): YearMonth[] {
		const fromMonth = (array: Month[]): YearMonth[] => {
			return array.map((month) => {
				if (month < PERIOD_START_MONTH) return { month, year: year + 1 };
				else return { month, year };
			});
		};

		if (this.range == "1q") return fromMonth(ImportRange._1q_list);
		else if (this.range == "2q") return fromMonth(ImportRange._2q_list);
		else if (this.range == "3q") return fromMonth(ImportRange._3q_list);
		else if (this.range == "4q") return fromMonth(ImportRange._4q_list);
		else if (this.range == "1q_and_2q")
			return fromMonth([...new Set(ImportRange._1q_list.concat(ImportRange._2q_list))]);
		else if (this.range == "3q_and_4q")
			return fromMonth([...new Set(ImportRange._3q_list.concat(ImportRange._4q_list))]);
		throw new Error("Invalid range");
	}

	static getQuarterRanges(year: number): {
		_1q_end: Dayjs;
		_1q_start: Dayjs;
		_2q_end: Dayjs;
		_2q_start: Dayjs;
		_3q_end: Dayjs;
		_3q_start: Dayjs;
		_4q_end: Dayjs;
		_4q_start: Dayjs;
	} {
		return {
			_1q_end: dayjs(`${year}-6-1`),
			_1q_start: dayjs(`${year}-4-1`),
			_2q_end: dayjs(`${year}-9-1`),
			_2q_start: dayjs(`${year}-6-1`),

			_3q_end: dayjs(`${year}-11-1`),
			_3q_start: dayjs(`${year}-9-1`),
			_4q_end: dayjs(`${year + 1}-3-1`),
			_4q_start: dayjs(`${year}-11-1`),
		};
	}

	getQuarterRange(year: number): Range {
		const r = ImportRange.getQuarterRanges(year);
		if (this.range == "1q") return { end: r._1q_end, start: r._1q_start };
		else if (this.range == "2q") return { end: r._2q_end, start: r._2q_start };
		else if (this.range == "3q") return { end: r._3q_end, start: r._3q_start };
		else if (this.range == "4q") return { end: r._4q_end, start: r._4q_start };
		else if (this.range == "1q_and_2q") return { end: r._2q_end, start: r._1q_start };
		return { end: r._4q_end, start: r._3q_start };
	}
}
