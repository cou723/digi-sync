import { ICalEventRepeatingFreq } from "ical-generator";


import { dayjsWapper } from "./dayjs";
import { API_RETURN_EventList } from "../../components/ImportIcalForm";
import { useClassTableIcalProps } from "../../hooks/ical-hook";

export type FormDateToIcalReturnType = useClassTableIcalProps["init"][0];

const FormDateToIcal = (
  args: API_RETURN_EventList["events"][0]
): FormDateToIcalReturnType => {
  const StartClassTime = dayjsWapper(args.start)
  const EndClassTime = dayjsWapper(args.start).add(90, "minutes")

  const ReturnValue: FormDateToIcalReturnType = {
    summary: args.title,
    start: StartClassTime.toDate(),
    end: EndClassTime.toDate(),
    timezone: dayjsWapper.tz.guess(),
    location: "〒101-0062 東京都千代田区神田駿河台４丁目６ 御茶ノ水ソラシティアカデミア 3F/4F"
  };

  return ReturnValue;
};

export default FormDateToIcal;
