import dayjs, { Dayjs } from "dayjs";
import { Session } from "next-auth";
import { FormInputs } from "./formInputsTypes";
import { Events, Event } from "./gapiCalendar";
import ImportRange from "./importRange";
import { ClassEvent, RawClassEvent } from "./types";
import {
	encodeQueryData,
	getClassEndTime,
	GetEventsErrorObject,
	isGetEventErrorObject,
	isRawClassEvent,
} from "libs/utils";

export async function postToGoogleCalendar(
	session: Session,
	raw_class_events: RawClassEvent[],
	count_setter,
	total_count_setter,
	inputs: FormInputs,
): Promise<void> {
	count_setter(0);
	if (!session) return;

	let class_events = raw_class_events.map((raw_class_event) => new ClassEvent(raw_class_event));

	let already_posted_event_list: Event[];
	try {
		already_posted_event_list = await getAlreadyPostedEvents(session.accessToken, inputs);

		class_events = class_events.filter(
			(class_event) => !isEventDuplicated(already_posted_event_list, class_event),
		);
	} catch (e) {
		console.log(e);
		alert("Google Calendarに登録されている既存の予定の取得に失敗しました");
		return;
	}

	total_count_setter(class_events.length);
	for (const class_event of class_events) {
		addEventToGoogleCal(class_event.start, class_event.title, session, inputs);
		count_setter((prev) => prev + 1);
		await new Promise(function (resolve) {
			setTimeout(resolve, 400);
		});
	}

	if (class_events.length == 0) {
		alert(`すべての予定がGoogle Calendarに追加されていたので、インポートしませんでした`);
	} else {
		// プログレスバーのアニメーションのために待機
		await new Promise(function (resolve) {
			setTimeout(resolve, 1000);
		});
		alert(`${class_events.length}件のインポートに成功しました`);
	}
}

export async function getAlreadyPostedEvents(accessToken: string, inputs: FormInputs) {
	let res: Events | GetEventsErrorObject;
	let next_page_token = "";
	const already_posted_events: Array<Event> = [];
	const { start, end } = new ImportRange(inputs.importRange).getQuarterRange(
		parseInt(inputs.importYear),
	);
	do {
		let query_param: { [key: string]: string | number | boolean };
		if (next_page_token != "") query_param = { pageToken: next_page_token };
		else {
			query_param = {
				maxResults: 2000,
				timeMax: end.toISOString(),
				timeMin: start.toISOString(),
				orderBy: "startTime",
				singleEvents: true,
			};
		}

		const google_api_url = `https://www.googleapis.com/calendar/v3/calendars/${
			inputs.toCalendar
		}/events?${encodeQueryData(query_param)}`;

		const raw_response = await fetch(google_api_url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});

		res = await raw_response.json();

		if (isGetEventErrorObject(res)) {
			console.error(res);
			throw Error(`status ${res.error.code}`);
		}

		already_posted_events.push(...res.items);

		if (res.nextPageToken) next_page_token = res.nextPageToken;
	} while (res.nextPageToken !== undefined);

	return already_posted_events;
}

async function addEventToGoogleCal(
	start: Dayjs,
	title: string,
	session: Session,
	inputs: FormInputs,
): Promise<void> {
	if (!(session && session.user)) return;
	// console.log(`add ${start} ${title}`)
	const google_api_url = `https://www.googleapis.com/calendar/v3/calendars/${inputs.toCalendar}/events`;
	const res = await fetch(google_api_url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${session.accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			end: { dateTime: getClassEndTime(start) },
			start: { dateTime: start.utc().format("YYYY-MM-DDTHH:mm:ssZZ") },
			summary: title,
			description: "#created_by_dp2gc",
		}),
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
function isEventDuplicated(already_posted_event_list: Event[], class_event: ClassEvent): boolean {
	for (const already_posted_event of already_posted_event_list) {
		if (!already_posted_event.start.dateTime) {
			continue;
		}

		const is_class_title_same =
			class_event.title.trim() ==
			(already_posted_event.summary ? already_posted_event.summary.trim() : false);
		const is_start_time_same =
			dayjs(class_event.start).toString() ==
			dayjs(already_posted_event.start.dateTime).toString();
		if (is_class_title_same && is_start_time_same) {
			return true;
		}
	}
	return false;
}
