
import { API_RETURN_EventList } from "../../components/importIcalForm";
import { useClassTableIcalProps } from "../../hooks/ical-hook";

import { dayjsWrapper } from "./dayjs";

export type FormDateToIcalReturnType = useClassTableIcalProps["init"][0];

const FormDateToIcal = (args: API_RETURN_EventList["events"][0]): FormDateToIcalReturnType => {
	const StartClassTime = dayjsWrapper(args.start);
	const EndClassTime = dayjsWrapper(args.start).add(90, "minutes");

	const ReturnValue: FormDateToIcalReturnType = {
		end: EndClassTime.toDate(),
		location:
			"デジタルハリウッド大学, 日本、〒101-0062 東京都千代田区神田駿河台４丁目６ 御茶ノ水ソラシティアカデミア 3F/4F",
		start: StartClassTime.toDate(),
		summary: args.title,
		timezone: dayjsWrapper.tz.guess(),
	};

	return ReturnValue;
};

export default FormDateToIcal;
