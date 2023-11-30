import ConvertDayOfWeekToNumber from "./ConvertDayOfWeekToNumber";
import { ShortDayOfWeekList } from "./types";

describe("ConvertDayOfWeekToNumber", () => {
	it("should return the correct number for each day of the week", () => {
		expect(ConvertDayOfWeekToNumber("Mon")).toBe(1);
		expect(ConvertDayOfWeekToNumber("Tue")).toBe(2);
		expect(ConvertDayOfWeekToNumber("Wed")).toBe(3);
		expect(ConvertDayOfWeekToNumber("Thu")).toBe(4);
		expect(ConvertDayOfWeekToNumber("Fri")).toBe(5);
		expect(ConvertDayOfWeekToNumber("Sat")).toBe(6);
	});

	it("should return -1 for invalid day of the week", () => {
		expect(ConvertDayOfWeekToNumber("InvalidDay" as ShortDayOfWeekList)).toBe(0);
	});
});
