import GetNextDayOfWeek, { GetNextDayOfWeekArgsType } from "./GetNextDayOfWeek";

describe("GetNextDayOfWeek", () => {
	it("should return the next day of the week correctly", () => {
		const args: GetNextDayOfWeekArgsType = {
			date: "2022-01-01", // Saturday
			dayOfWeek: 0, // Sunday
			includeToday: false,
		};

		expect(GetNextDayOfWeek(args)).toEqual(new Date("2022-01-02")); // Next Sunday
	});

	it("should include today if includeToday is true", () => {
		const args: GetNextDayOfWeekArgsType = {
			date: "2022-01-01", // Saturday
			dayOfWeek: 6, // Saturday
			includeToday: true,
		};

		expect(GetNextDayOfWeek(args)).toEqual(new Date("2022-01-01")); // Same Saturday
	});
});
