import { API_RETURN_EventList } from "../../components/importIcalForm";

import formDateToIcal from "./formDateToIcal";

export const convertToIcalMap = (formData: API_RETURN_EventList["events"]) => {
	console.log(formData);
	return formData
		.map((value) => {
			if (value.title.length == 0) throw new Error("error type m");
			return formDateToIcal(value);
		})
		.filter((list) => list !== null);
};
