import addClassStartTime, { AddClassStartTimeArgsType } from "./addClassStartTime";

describe("AddClassStartTime", () => {
	it("should return the correct start time for the given period index", () => {
		const args: AddClassStartTimeArgsType = {
			lessonTimes: [
				{ hour: 8, minute: 0 },
				{ hour: 9, minute: 30 },
				{ hour: 11, minute: 0 },
				{ hour: 13, minute: 30 },
				{ hour: 15, minute: 0 },
				{ hour: 16, minute: 30 },
			],
			periodIndex: 2,
		};

		expect(addClassStartTime(args)).toEqual(660);
	});
});
