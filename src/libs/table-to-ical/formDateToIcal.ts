import { API_RETURN_EventList } from "../../components/importIcalForm";
import { useClassTableIcalProps } from "../../hooks/icalHook";

import { dayjsWrapper } from "./dayjs";

export type IcalEvent = useClassTableIcalProps["init"][0];

const formDateToIcal = (args: API_RETURN_EventList["events"][0]): IcalEvent => {
	const startClassTime = dayjsWrapper(args.start);
	const endClassTime = dayjsWrapper(args.start).add(90, "minutes");

	const icalEvent: IcalEvent = {
		end: endClassTime.toDate(),
		location:
			"デジタルハリウッド大学, 日本、〒101-0062 東京都千代田区神田駿河台４丁目６ 御茶ノ水ソラシティアカデミア 3F/4F",
		start: startClassTime.toDate(),
		summary: args.title,
		timezone: dayjsWrapper.tz.guess(),
	};

	return icalEvent;
};

export default formDateToIcal;
