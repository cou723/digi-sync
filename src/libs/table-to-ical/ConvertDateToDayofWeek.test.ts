import ConvertDateToDayOfWeek from "./ConvertDateToDayofWeek";

describe("convertDateToDayOfWeek", () => {
	it("should return the correct day of the week for a given date", () => {
		// Test cases
		const testCases = [
			{ date: new Date("2022-01-01").toString(), expected: 6 },
			{ date: new Date("2022-01-02").toString(), expected: 0 },
			{ date: new Date("2022-01-03").toString(), expected: 1 },
			// Add more test cases as needed
		];

		// Run the tests
		testCases.forEach((testCase) => {
			const { date, expected } = testCase;
			const result = ConvertDateToDayOfWeek(date);
			expect(result).toBe(expected);
		});
	});
});
