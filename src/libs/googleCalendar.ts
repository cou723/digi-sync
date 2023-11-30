import dayjs, { Dayjs } from "dayjs";
import { NextRouter } from "next/router";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";

import { FormInputs } from "@/types/formInputsTypes";
import { Calendar, Events, Event, CalendarList, CalendarListEntry } from "@/types/gapiCalendar";
import ImportRange from "@/types/importRange";
import { ClassEvent, RawClassEvent } from "@/types/types";

import {
	encodeQueryData,
	GetEventsErrorObject,
	isGetEventErrorObject,
	getClassEndTime,
} from "./utils";

export type CalendarId = string;

// DigisyncEventsとは詳細欄に #created_by_dp2gc が含まれているイベントを指す
async function getAllDigisyncEvents(session: Session): Promise<Map<CalendarId, Event[]>> {
	const allCalendarList: Calendar[] = await getAllCalendars(session);
	const allEvents: Map<CalendarId, Event[]> = new Map();

	for (const calendar of allCalendarList) {
		const queryParam: { [key: string]: string | number | boolean } = {
			maxResults: 2000,
			orderBy: "startTime",
			singleEvents: true,
		};

		const googleApiUrl = `https://www.googleapis.com/calendar/v3/calendars/${
			calendar.id
		}/events?${encodeQueryData(queryParam)}`;
		const rawResponse = await fetch(googleApiUrl, {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
				"Content-Type": "application/json",
			},
			method: "GET",
		});
		const res: Events | GetEventsErrorObject = await rawResponse.json();
		if (isGetEventErrorObject(res)) {
			console.error(res);
			continue;
		}
		allEvents.set(
			calendar.id,
			res.items.filter(
				(event) => event.description && event.description.includes("#created_by_dp2gc"),
			),
		);
	}
	return allEvents;
}

async function deleteEvents(
	deleteEventUrlList: string[],
	session: Session,
	progressSetter: Dispatch<SetStateAction<number>>,
) {
	for (const DeleteUrl of deleteEventUrlList) {
		fetch(DeleteUrl, {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
				"Content-Type": "application/json",
			},
			method: "DELETE",
		});
		progressSetter((deleteCount: number) => deleteCount + 1);
		await new Promise(function (resolve) {
			setTimeout(resolve, 250);
		});
	}
}

async function getAllCalendars(session: Session) {
	const res: Response = await fetch(
		"https://www.googleapis.com/calendar/v3/users/me/calendarList",
		{
			headers: { Authorization: `Bearer ${session.accessToken}` },
			method: "GET",
		},
	);
	return (await res.json()).items;
}

async function getMyCalendarList(
	session: Session,
	router: NextRouter,
): Promise<CalendarListEntry[]> {
	if (!(session && session.user)) {
		router.push("/login");
		return [];
	}
	try {
		const res = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
			headers: { Authorization: `Bearer ${session.accessToken}` },
			method: "GET",
		});
		const data = await res.json();
		if (data.error !== undefined && data.error.code >= 400) {
			signOut();
			router.push("/login");
			return [];
		}
		const calendarListEntry: CalendarList = data;

		return calendarListEntry.items.filter((calendar) => calendar.accessRole === "owner");
	} catch (e: unknown) {
		alert("カレンダーの取得に失敗しました。ページをリロードしてもう一度やり直してください。");
		return [];
	}
}

export async function post(
	session: Session,
	rawClassEvents: RawClassEvent[],
	setCount: Dispatch<SetStateAction<number>>,
	setTotalCount: Dispatch<SetStateAction<number>>,
	inputs: FormInputs,
): Promise<void> {
	setCount(0);
	if (!session) return;

	let classEvents = rawClassEvents.map((raw_class_event) => new ClassEvent(raw_class_event));

	let alreadyPostedEventList: Event[];
	try {
		alreadyPostedEventList = await getAlreadyPostedEvents(session.accessToken, inputs);

		classEvents = classEvents.filter(
			(class_event) => !isEventDuplicated(alreadyPostedEventList, class_event),
		);
	} catch (e) {
		console.log(e);
		alert("Google Calendarに登録されている既存の予定の取得に失敗しました");
		return;
	}

	setTotalCount(classEvents.length);
	for (const classEvent of classEvents) {
		addEvent(classEvent.start, classEvent.title, session, inputs);
		setCount((prev) => prev + 1);
		await new Promise(function (resolve) {
			setTimeout(resolve, 400);
		});
	}

	if (classEvents.length == 0) {
		alert(`すべての予定がGoogle Calendarに追加されていたので、インポートしませんでした`);
	} else {
		// プログレスバーのアニメーションのために待機
		await new Promise(function (resolve) {
			setTimeout(resolve, 1000);
		});
		alert(`${classEvents.length}件のインポートに成功しました`);
	}
}

export async function getAlreadyPostedEvents(accessToken: string, inputs: FormInputs) {
	let res: Events | GetEventsErrorObject;
	let nextPageToken = "";
	const alreadyPostedEvents: Array<Event> = [];
	const { start, end } = new ImportRange(inputs.importRange).getQuarterRange(
		parseInt(inputs.importYear),
	);
	do {
		let queryParam: { [key: string]: string | number | boolean };
		if (nextPageToken != "") queryParam = { pageToken: nextPageToken };
		else {
			queryParam = {
				maxResults: 2000,
				orderBy: "startTime",
				singleEvents: true,
				timeMax: end.toISOString(),
				timeMin: start.toISOString(),
			};
		}

		const googleApiUrl = `https://www.googleapis.com/calendar/v3/calendars/${
			inputs.toCalendar
		}/events?${encodeQueryData(queryParam)}`;

		const rawResponse = await fetch(googleApiUrl, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			method: "GET",
		});

		res = await rawResponse.json();

		if (isGetEventErrorObject(res)) {
			console.error(res);
			throw Error(`status ${res.error.code}`);
		}

		alreadyPostedEvents.push(...res.items);

		if (res.nextPageToken) nextPageToken = res.nextPageToken;
	} while (res.nextPageToken !== undefined);

	return alreadyPostedEvents;
}

async function addEvent(
	start: Dayjs,
	title: string,
	session: Session,
	inputs: FormInputs,
): Promise<void> {
	if (!(session && session.user)) return;
	// console.log(`add ${start} ${title}`)
	const googleApiUrl = `https://www.googleapis.com/calendar/v3/calendars/${inputs.toCalendar}/events`;
	const res = await fetch(googleApiUrl, {
		body: JSON.stringify({
			description: "#created_by_dp2gc",
			end: { dateTime: getClassEndTime(start) },
			start: { dateTime: start.utc().format("YYYY-MM-DDTHH:mm:ssZZ") },
			summary: title,
		}),
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
			"Content-Type": "application/json",
		},
		method: "POST",
	});
	if (res.status >= 400) {
		res.json().then((data) => {
			console.log(data);
		});
		alert(
			`${start}から始まる${title}の追加に失敗しました。もう一度インポートするとうまくいく場合があります。`,
		);
	}
}

// If we sort Event, we can bisect the search by date.
function isEventDuplicated(alreadyPostedEventList: Event[], classEvent: ClassEvent): boolean {
	for (const alreadyPostedEvent of alreadyPostedEventList) {
		if (!alreadyPostedEvent.start.dateTime) {
			continue;
		}

		const isClassTitleSame =
			classEvent.title.trim() ==
			(alreadyPostedEvent.summary ? alreadyPostedEvent.summary.trim() : false);
		const isStartTimeSame =
			dayjs(classEvent.start).toString() ==
			dayjs(alreadyPostedEvent.start.dateTime).toString();
		if (isClassTitleSame && isStartTimeSame) {
			return true;
		}
	}
	return false;
}

export const GoogleCalendar = {
	addEvent,
	deleteEvents,
	getAllCalendars,
	getAllDigisyncEvents,
	getAlreadyPostedEvents,
	getMyCalendarList,
	isEventDuplicated,
	post,
};
