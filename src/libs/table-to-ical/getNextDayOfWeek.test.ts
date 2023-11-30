import dayjs from "dayjs";

import getNextDayOfWeek, { GetNextDayOfWeekArgsType } from "./getNextDayOfWeek";

describe("GetNextDayOfWeek", () => {
	it("should return the next day of the week correctly", () => {
		const args: GetNextDayOfWeekArgsType = {
			date: "2022-01-01", // Saturday
			dayOfWeek: 0, // Sunday
			includeToday: false,
		};

		expect(getNextDayOfWeek(args)).toEqual(dayjs("2022-01-02").toDate()); // Next Sunday
	});

	it("should include today if includeToday is true", () => {
		const args: GetNextDayOfWeekArgsType = {
			date: "2022-01-01", // Saturday
			dayOfWeek: 6, // Saturday
			includeToday: true,
		};

		expect(getNextDayOfWeek(args)).toEqual(dayjs("2022-01-01").toDate());
	});
});
