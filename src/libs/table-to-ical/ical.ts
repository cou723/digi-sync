import ical, { ICalCalendar } from "ical-generator";

import { Dayjs, dayjsWrapper } from "./dayjs";

export const GetClaender = (): ICalCalendar => {
	const calendar = ical({ name: "授業の時間" });
	type classListType = {
		end: Dayjs;
		start: Dayjs;
		summary: string;
		title: string;
	};
	const classList = (): classListType[] => [
		{
			end: dayjsWrapper().hour(10).weekday(1).add(1.5, "hour"),
			start: dayjsWrapper().hour(10).weekday(1),
			summary: "テストの授業1つ目です",
			title: "1つ目",
		},
		{
			end: dayjsWrapper().hour(13).weekday(4).add(1.5, "hour"),
			start: dayjsWrapper().hour(13).weekday(4),
			summary: "テストの授業1つ目です",
			title: "2つ目",
		},
		{
			end: dayjsWrapper().hour(16).weekday(6).add(1.5, "hour"),
			start: dayjsWrapper().hour(16).weekday(6),
			summary: "テストの授業1つ目です",
			title: "2つ目",
		},
	];
	classList().map((value) => {
		for (let i = 0; i < 6; i++) {
			calendar.createEvent({
				description: value.summary,
				end: value.end.add(i, "week").toDate(),
				start: value.start.add(i, "week").toDate(),
				summary: value.title,
			});
		}
	});

	return calendar;
};
