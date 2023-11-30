import ImportRange from "./importRange";

describe("ImportRange", () => {
	describe("getYearMonthList", () => {
		it("should return the correct year month list", () => {
			const importRange = new ImportRange("1q");
			const yearMonthList = importRange.getYearMonthList(2022);
			expect(yearMonthList).toEqual([
				{ month: 4, year: 2022 },
				{ month: 5, year: 2022 },
				{ month: 6, year: 2022 },
			]);
		});

		it("should return the correct year month list", () => {
			const importRange = new ImportRange("2q");
			const yearMonthList = importRange.getYearMonthList(2022);
			expect(yearMonthList).toEqual([
				{ month: 6, year: 2022 },
				{ month: 7, year: 2022 },
				{ month: 8, year: 2022 },
			]);
		});

		it("should return the correct year month list", () => {
			const importRange = new ImportRange("3q");
			const yearMonthList = importRange.getYearMonthList(2022);
			expect(yearMonthList).toEqual([
				{ month: 9, year: 2022 },
				{ month: 10, year: 2022 },
				{ month: 11, year: 2022 },
			]);
		});

		it("should return the correct year month list", () => {
			const importRange = new ImportRange("4q");
			const yearMonthList = importRange.getYearMonthList(2022);
			expect(yearMonthList).toEqual([
				{ month: 11, year: 2022 },
				{ month: 12, year: 2022 },
				{ month: 1, year: 2023 },
				{ month: 2, year: 2023 },
				{ month: 3, year: 2023 },
			]);
		});
	});
});
