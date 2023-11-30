import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

import { RawClassEvent } from "@/types/types";
dayjs.extend(utc);

export function encodeQueryData(data: { [key: string]: string | number | boolean }) {
	const searchParams = new URLSearchParams();
	for (const key in data) {
		const value = String(data[key]);
		searchParams.set(key, value);
	}
	return searchParams.toString();
}

export function getClassEndTime(classStartTime: Dayjs): string {
	classStartTime.add(90, "minute");
	return classStartTime.add(90, "minute").utc().format("YYYY-MM-DDTHH:mm:ssZZ");
}

export interface GetEventsErrorObject {
	error: {
		code: number;
		errors: [
			{
				domain: string;
				message: string;
				reason: string;
			},
		];
		message: string;
	};
}

export function isGetEventErrorObject(obj: object): obj is GetEventsErrorObject {
	if (!(typeof obj == "object" && "error" in obj)) return false;
	return !!(
		typeof obj.error == "object" &&
		obj.error &&
		"errors" in obj.error &&
		"code" in obj.error &&
		"message" in obj.error &&
		Array.isArray(obj.error.errors) &&
		obj.error.errors &&
		obj.error.errors[0] &&
		"domain" in obj.error.errors[0] &&
		"reason" in obj.error.errors[0] &&
		"message" in obj.error.errors[0]
	);
}

export function isRawClassEvent(obj: object): obj is RawClassEvent {
	if (!(typeof obj == "object" && obj)) return false;
	return !!(
		"id" in obj &&
		typeof obj.id == "string" &&
		"title" in obj &&
		typeof obj.title == "string" &&
		"start" in obj &&
		typeof obj.start == "string" &&
		"end" in obj &&
		typeof obj.end == "string" &&
		"allDay" in obj &&
		typeof obj.allDay == "boolean" &&
		"editable" in obj &&
		typeof obj.editable == "boolean" &&
		"className" in obj &&
		(typeof obj.className == "string" || typeof obj.className == "object")
	);
}

export function getNowAcademicYear(): number {
	const thisMonth = dayjs().month();
	if (thisMonth >= 1 && thisMonth <= 2) return dayjs().year() - 1;
	return dayjs().year();
}
