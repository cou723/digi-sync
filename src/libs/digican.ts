import { FormInputs } from "@/types/formInputsTypes";
import { RawClassEvent } from "@/types/types";

export async function fetchClassEvents(
	formState: FormInputs,
	error_message: string,
): Promise<RawClassEvent[]> {
	let event_list: RawClassEvent[];

	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/classEvents" , {
			body:JSON.stringify({
				importRange: formState.importRange,
				importYear: formState.importYear,
				password: formState.password,
				username: formState.username,
			}),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST"
		});

		if (!res.ok) throw new Error(res.status.toString());
		event_list = await res.json();
	} catch {
		throw new Error(error_message);
	}
	return event_list;
}

export const Digican = {
	fetchClassEvents,
};
