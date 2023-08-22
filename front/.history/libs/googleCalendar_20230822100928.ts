import { encodeQueryData, GetEventsErrorObject, isGetEventErrorObject } from "./utils";
import { Calendar, Events, Event } from "types/gapiCalendar";

export type CalendarId = string;

export async function getAllEventsFromGoogleCalendar(
	all_calendar_list: Calendar[],
	session,
): Promise<Map<CalendarId, Event[]>> {
	const all_events: Map<CalendarId, Event[]> = new Map();

	for (const calendar of all_calendar_list) {
		const query_param: { [key: string]: string | number | boolean } = {
			maxResults: 2000,
			orderBy: "startTime",
			singleEvents: true,
		};

		const google_api_url = `https://www.googleapis.com/calendar/v3/calendars/${
			calendar.id
		}/events?${encodeQueryData(query_param)}`;
		const raw_response = await fetch(google_api_url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
				"Content-Type": "application/json",
			},
		});
		const res: Events | GetEventsErrorObject = await raw_response.json();
		if (isGetEventErrorObject(res)) {
			console.error(res);
			continue;
		}
		all_events.set(
			calendar.id,
			res.items.filter(
				(event) => event.description && event.description.includes("#created_by_dp2gc"),
			),
		);
	}
	return all_events;
}

export async function deleteGoogleCalendarEvent(delete_event_url_list, session, progressSetter) {
	for (const delete_url of delete_event_url_list) {
		fetch(delete_url, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
				"Content-Type": "application/json",
			},
		});
		progressSetter((deleteCount) => deleteCount + 1);
		await new Promise(function (resolve) {
			setTimeout(resolve, 250);
		});
	}
}
