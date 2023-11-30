import convertDayOfWeekToNumber from "./convertDayOfWeekToNumber";
import { ShortDayOfWeekEn } from "./types";

describe("ConvertDayOfWeekToNumber", () => {
	it("should return the correct number for each day of the week", () => {
		expect(convertDayOfWeekToNumber("Mon")).toBe(1);
		expect(convertDayOfWeekToNumber("Tue")).toBe(2);
		expect(convertDayOfWeekToNumber("Wed")).toBe(3);
		expect(convertDayOfWeekToNumber("Thu")).toBe(4);
		expect(convertDayOfWeekToNumber("Fri")).toBe(5);
		expect(convertDayOfWeekToNumber("Sat")).toBe(6);
	});

	it("should return -1 for invalid day of the week", () => {
		expect(convertDayOfWeekToNumber("InvalidDay" as ShortDayOfWeekEn)).toBe(0);
	});
});
