import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { Control } from "react-hook-form";

import { useCustomSession } from "@/hooks/useCustomSession";
import { GoogleCalendar } from "@/libs/googleCalendar";
import { FormInputs, GoogleFormInputs } from "@/types/formInputsTypes";
import { CalendarListEntry } from "@/types/gapiCalendar";

import RhfMuiSelect from "../importFormCommon/rhfMuiSelect";

type Props = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<FormInputs, any> | Control<GoogleFormInputs, any>;
	disabled: boolean;
	errorMessage: string | undefined;
};

const ToCalendarSelect = React.memo(function ToCalendarSelect({
	control,
	disabled,
}: Props) {
	const { t } = useTranslation("components");
	const [calendars, setCalendars] = useState<Array<CalendarListEntry>>([]);
	const { session, authStatus } = useCustomSession();
	const router = useRouter();

	useEffect(() => {
		(async () => {
			if (authStatus === "authenticated")
				setCalendars(await GoogleCalendar.getMyCalendarList(session, router));
		})();
	}, [router, session, authStatus]);

	return (
		<>
			<RhfMuiSelect
				control={control}
				disabled={disabled}
				label={t("importModules.ToCalendarSelect.label")}
				name='toCalendar'
				options={calendars.map((calendar) => calendar.id)}
			/>
		</>
	);
});

export default ToCalendarSelect;
