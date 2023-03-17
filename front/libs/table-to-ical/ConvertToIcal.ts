import { API_RETURN_EventList } from "../../components/ImportIcalForm";

import FormDateToIcal from "./FormDateToIcal";

export const ConvertToIcalMap = (
  FormData: API_RETURN_EventList["events"],
) => {
  return FormData
    .map((value) => {
      if (value.title.length > 0) {
        return FormDateToIcal(value);
      }
      return null;
    })
    .filter((list) => list !== null);
};

