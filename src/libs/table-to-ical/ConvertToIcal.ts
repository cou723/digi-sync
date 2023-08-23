import { API_RETURN_EventList } from "../../components/importIcalForm";

import FormDateToIcal from "./FormDateToIcal";

export const ConvertToIcalMap = (FormData: API_RETURN_EventList["events"]) => {
	console.log(FormData);
	return FormData.map((value) => {
		if (value.title.length == 0) throw new Error("error type m");
		return FormDateToIcal(value);
	}).filter((list) => list !== null);
};
