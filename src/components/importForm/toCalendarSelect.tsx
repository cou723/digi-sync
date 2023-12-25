import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Control } from "react-hook-form";

import RhfMuiSelect from "@/components/utils/rhfMuiSelect";
import { useCustomSession } from "@/hooks/useCustomSession";
import { GoogleCalendar } from "@/libs/googleCalendar";
import { FormInputs, GoogleFormInputs } from "@/types/formInputsTypes";
import { CalendarListEntry } from "@/types/gapiCalendar";

type Props = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<FormInputs, any> | Control<GoogleFormInputs, any>;
	disabled: boolean;
	errorMessage: string | undefined;
};

const ToCalendarSelect = React.memo(function ToCalendarSelect({ control, disabled }: Props) {
	const [calendars, setCalendars] = useState<Array<CalendarListEntry>>([]);
	const { session, authStatus } = useCustomSession();
	const router = useRouter();

	useEffect(() => {
		if (authStatus === "authenticated")
			GoogleCalendar.getMyCalendarList(session, router).then((res) => setCalendars(res));
	}, [session, authStatus, router]);

	return (
		<>
			<RhfMuiSelect
				control={control}
				disabled={disabled}
				label='インポート先のカレンダーを選択してください'
				name='toCalendar'
				options={calendars.map((calendar) => ({
					label: calendar.summary,
					value: calendar.id,
				}))}
			/>
		</>
	);
});

export default ToCalendarSelect;
