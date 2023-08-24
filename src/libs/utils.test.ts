import dayjs from "dayjs";

import ImportRange from "@/types/importRange";

import * as utils from "./utils";

test("encodeQueryData", () => {
	expect(utils.encodeQueryData({ a: "a", b: "b" })).toBe("a=a&b=b");
	expect(utils.encodeQueryData({ a: 1, b: "b" })).toBe("a=1&b=b");
});

test("getEndTime", () => {
	expect(utils.getClassEndTime(dayjs("2020-01-01T00:00:00+0000"))).toBe(
		"2020-01-01T01:30:00+0000",
	);
});

test("getQueryRange", () => {
	const year = 2020;
	expect(new ImportRange("1q").getQuarterRange(year)).toEqual({
		end: dayjs(`${year}-6-1`),
		start: dayjs(`${year}-4-1`),
	});
});

test("getQuarterRanges", () => {
	const year = 2022;
	expect(ImportRange.getQuarterRanges(year)).toEqual({
		_1q_end: dayjs(`${year}-6-1`),
		_1q_start: dayjs(`${year}-4-1`),
		_2q_end: dayjs(`${year}-9-1`),
		_2q_start: dayjs(`${year}-6-1`),

		_3q_end: dayjs(`${year}-11-1`),
		_3q_start: dayjs(`${year}-9-1`),
		_4q_end: dayjs(`${year + 1}-3-1`),
		_4q_start: dayjs(`${year}-11-1`),
	});
});

test("isGetEventErrorObject", () => {
	expect(utils.isGetEventErrorObject({})).toBe(false);
	expect(utils.isGetEventErrorObject({ error: {} })).toBe(false);
	expect(
		utils.isGetEventErrorObject({
			error: {
				errors: [],
			},
		}),
	).toBe(false);
	expect(
		utils.isGetEventErrorObject({
			error: {
				code: 1,
				errors: [],
			},
		}),
	).toBe(false);
	expect(
		utils.isGetEventErrorObject({
			error: {
				code: 100,
				errors: [],
				message: "message",
			},
		}),
	).toBe(false);
	expect(
		utils.isGetEventErrorObject({
			error: {
				code: 100,
				errors: [
					{
						domain: "domain",
					},
				],
				message: "message",
			},
		}),
	).toBe(false);
	expect(
		utils.isGetEventErrorObject({
			error: {
				code: 100,
				errors: [
					{
						domain: "string",
						reason: "reason",
					},
				],
				message: "message",
			},
		}),
	).toBe(false);
	expect(
		utils.isGetEventErrorObject({
			error: {
				code: 100,
				errors: [
					{
						domain: "string",
						message: "string",
						reason: "string",
					},
				],
				message: "string",
			},
		}),
	).toBe(true);
});

// toBeの先を今年度に変えること
// test('getNowAcademicYear', () => {
//     expect(utils.getNowAcademicYear()).toBe(2023)
// })
