import { FormInputs } from "@/types/formInputsTypes";
import { RawClassEvent } from "@/types/types";

export async function fetchClassEvents(
	formState: FormInputs,
	errorMessage: string,
): Promise<RawClassEvent[]> {
	let eventList: RawClassEvent[];

	console.log(formState.importRange);
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + "/classEvents", {
			body: JSON.stringify({
				importRange: formState.importRange,
				importYear: formState.importYear,
				password: formState.password,
				username: formState.username,
			}),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		});

		if (!res.ok) throw new Error(res.status.toString());
		eventList = await res.json();
	} catch {
		throw new Error(errorMessage);
	}
	return eventList;
}

export const Digican = {
	fetchClassEvents,
};
