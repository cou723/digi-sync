import dayjs from "dayjs";
import ImportRange from "../types/importRange";
import * as utils from "./utils";

test("encodeQueryData", () => {
    expect(utils.encodeQueryData({ a: "a", b: "b" })).toBe("a=a&b=b");
    expect(utils.encodeQueryData({ a: 1, b: "b" })).toBe("a=1&b=b");
});

test("getEndTime", () => {
    expect(utils.getClassEndTime("2020-01-01T00:00:00+0000")).toBe("2020-01-01T01:30:00+0000");
});

test("getQueryRange", () => {
    const year = 2020;
    expect(new ImportRange("1q").getQuarterRange(year)).toEqual({
        start: dayjs(`${year}-4-1`),
        end: dayjs(`${year}-6-1`),
    });
});

test("getQuarterRanges", () => {
    const year = 2022;
    expect(ImportRange.getQuarterRanges(year)).toEqual({
        _1q_start: dayjs(`${year}-4-1`),
        _2q_start: dayjs(`${year}-6-1`),
        _3q_start: dayjs(`${year}-9-1`),
        _4q_start: dayjs(`${year}-11-1`),

        _1q_end: dayjs(`${year}-6-1`),
        _2q_end: dayjs(`${year}-9-1`),
        _3q_end: dayjs(`${year}-11-1`),
        _4q_end: dayjs(`${year + 1}-3-1`),
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
                errors: [],
                code: 1,
            },
        }),
    ).toBe(false);
    expect(
        utils.isGetEventErrorObject({
            error: {
                errors: [],
                code: 100,
                message: "message",
            },
        }),
    ).toBe(false);
    expect(
        utils.isGetEventErrorObject({
            error: {
                errors: [
                    {
                        domain: "domain",
                    },
                ],
                code: 100,
                message: "message",
            },
        }),
    ).toBe(false);
    expect(
        utils.isGetEventErrorObject({
            error: {
                errors: [
                    {
                        domain: "string",
                        reason: "reason",
                    },
                ],
                code: 100,
                message: "message",
            },
        }),
    ).toBe(false);
    expect(
        utils.isGetEventErrorObject({
            error: {
                errors: [
                    {
                        domain: "string",
                        reason: "string",
                        message: "string",
                    },
                ],
                code: 100,
                message: "string",
            },
        }),
    ).toBe(true);
});

// toBeの先を今年度に変えること
// test('getNowAcademicYear', () => {
//     expect(utils.getNowAcademicYear()).toBe(2023)
// })
