import { FormInputs } from "@/types/formInputsTypes";
import { RawClassEvent } from "@/types/types";

export async function fetchClassEvents(
	formState: FormInputs,
	error_message: string,
): Promise<RawClassEvent[]> {
	let res: Response;
	let event_list: RawClassEvent[];

	const query_param_obj = {
		importRange: formState.importRange,
		importYear: formState.importYear,
		password: formState.password,
		username: formState.username,
	};

	const query_param_str = new URLSearchParams(query_param_obj).toString();

	try {
		res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/class_events?" + query_param_str, {
			method: "GET",
		});

		if (!res.ok) throw new Error();
		event_list = await res.json();
	} catch {
		throw new Error(error_message);
	}
	return event_list;
}

export const Digican = {
	fetchClassEvents,
};
