import convertTimeToMinAndHours from "./convertTimeToMinAndHours";

describe("ConvertTimeToMinAndHours", () => {
	it("should convert time string to hours and minutes", () => {
		expect(convertTimeToMinAndHours({ time: "12:34" })).toEqual({
			hour: 12,
			minute: 34,
		});
		expect(convertTimeToMinAndHours({ time: "100:100" })).toEqual({
			hour: 100,
			minute: 100,
		});
	});
});
