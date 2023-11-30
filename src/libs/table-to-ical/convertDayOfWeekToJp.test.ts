import convertDayOfWeekToJp from "./convertDayOfWeekToJp";

describe("ConvertDayOfWeekToJp", () => {
	it("should convert day of week to Japanese", () => {
		// Test case 1: Convert "Mon" to "月"
		expect(convertDayOfWeekToJp("Mon")).toBe("月");

		// Test case 2: Convert "Tue" to "火"
		expect(convertDayOfWeekToJp("Tue")).toBe("火");

		// Test case 3: Convert "Wed" to "水"
		expect(convertDayOfWeekToJp("Wed")).toBe("水");

		// Test case 4: Convert "Thu" to "木"
		expect(convertDayOfWeekToJp("Thu")).toBe("木");

		// Test case 5: Convert "Fri" to "金"
		expect(convertDayOfWeekToJp("Fri")).toBe("金");

		// Test case 6: Convert "Sat" to "土"
		expect(convertDayOfWeekToJp("Sat")).toBe("土");
	});
});
