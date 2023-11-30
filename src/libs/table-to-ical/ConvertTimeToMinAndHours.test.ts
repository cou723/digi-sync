import ConvertTimeToMinAndHours from "./ConvertTimeToMinAndHours";

describe("ConvertTimeToMinAndHours", () => {
	it("should convert time string to hours and minutes", () => {
		expect(ConvertTimeToMinAndHours({ time: "12:34" })).toEqual({
			hour: 12,
			minute: 34,
		});
		expect(ConvertTimeToMinAndHours({ time: "100:100" })).toEqual({
			hour: 100,
			minute: 100,
		});
	});
});
