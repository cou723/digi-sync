export async function fetchClassEventList(
	formState: FormInputs,
	error_message: string,
): Promise<RawClassEvent[]> {
	let res: Response;
	let event_list: RawClassEvent[];

	const query_param_obj = {
		importYear: formState.importYear,
		importRange: formState.importRange,
		username: formState.username,
		password: formState.password,
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
	fetchClassEventList,
};
