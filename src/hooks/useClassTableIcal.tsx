import { ICalEvent, ICalEventData } from "ical-generator";
import { Dispatch, SetStateAction, useState } from "react";

import { downloadBrowser } from "@/libs/table-to-ical/downloadBrowser";

export type useClassTableIcalProps = {
	init: Array<ICalEvent | ICalEventData>;
};
export type useClassTableIcalTypes = {
	AddEvent: (event: useClassTableIcalProps["init"]) => void;
	CalenderEvents: useClassTableIcalProps["init"];
	DownloadFile: (event: useClassTableIcalProps["init"]) => Promise<string | null>;
	setCalenderEvents: Dispatch<SetStateAction<(ICalEvent | ICalEventData)[]>>;
};

// TODO: 名前の修正
// classTableってなに？
export const useClassTableIcal = (props?: useClassTableIcalProps): useClassTableIcalTypes => {
	const [CalenderEvents, setCalenderEvents] = useState<useClassTableIcalProps["init"]>(
		props?.init || [],
	);

	const AddEvent = (event: useClassTableIcalProps["init"]) => {
		setCalenderEvents((pre) => {
			return event.concat(pre);
		});
	};

	// ファイルをダウンロード
	const DownloadFile = async (event: useClassTableIcalProps["init"]): Promise<string> => {
		try {
			return downloadBrowser(event);
		} catch (error) {
			console.error(" can not download", error);
			return "/";
		}
	};

	return {
		AddEvent,
		CalenderEvents,
		DownloadFile,
		setCalenderEvents,
	};
};
