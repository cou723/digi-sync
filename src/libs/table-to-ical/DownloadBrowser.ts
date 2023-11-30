import ical from "ical-generator";

import { useClassTableIcalProps } from "../../hooks/icalHook";

export const DownloadBrowser = (event: useClassTableIcalProps["init"]): string => {
	const calendar = ical({ name: "授業の時間" });

	calendar.description("大学の授業のカレンダー");

	calendar.clear();
	event.map((event) => {
		calendar.createEvent(event);
	});
	const calendarUrl = calendar.toURL();
	const dummyLinkElement = document.createElement("a");

	document.body.appendChild(dummyLinkElement);

	// a 要素の href 属性に Object URL をセット
	dummyLinkElement.href = calendarUrl;

	// a 要素の download 属性にファイル名をセット
	dummyLinkElement.download = "大学の授業.ics";
	dummyLinkElement.click();
	// document.body.removeChild(dummy_a_el);

	return calendarUrl || "/";
};
