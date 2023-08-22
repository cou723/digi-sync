import dayjs, { Dayjs } from "dayjs";

import { Range } from "../types/types";
export type ImportRangeString = "1q" | "2q" | "3q" | "4q" | "1q_and_2q" | "3q_and_4q";

export default class ImportRange {
	range: ImportRangeString;
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

	getMonthList(): number[] {
		const _1q_list = [4, 5, 6];
		const _2q_list = [6, 7, 8];
		const _3q_list = [8, 9, 10];
		const _4q_list = [10, 11, 12, 1, 2, 3];

		if (this.range == "1q") return _1q_list;
		else if (this.range == "2q") return _2q_list;
		else if (this.range == "3q") return _3q_list;
		else if (this.range == "4q") return _4q_list;
		else if (this.range == "1q_and_2q") return _1q_list.concat(_2q_list);
		else if (this.range == "3q_and_4q") return _3q_list.concat(_4q_list);
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
