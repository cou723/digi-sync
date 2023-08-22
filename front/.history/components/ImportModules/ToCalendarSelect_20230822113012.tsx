import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { GoogleCalendar } from "libs/googleCalendar";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import React, { ReactNode, useEffect, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { FormInputs, GoogleFormInputs } from "types/formInputsTypes";
import { CalendarList, CalendarListEntry } from "types/gapiCalendar";

type Props = {
	register: UseFormRegister<FormInputs> | UseFormRegister<GoogleFormInputs>;
	disabled: boolean;
	errorMessage: string;
	value: string;
	onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
	setAccessToken: (accessToken: string) => void;
};

const ToCalendarSelect = React.memo(function ToCalendarSelect({
	register,
	disabled,
	errorMessage,
	value,
	onChange,
	setAccessToken,
}: Props) {
	const { t } = useTranslation("components");
	const [calendars, setCalendars] = useState<Array<CalendarListEntry>>([]);
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		(async () => {
			setCalendars(await GoogleCalendar.getMyCalendarList(session, signOut, router));
			setAccessToken(session.accessToken);
		})();
	}, [session, setAccessToken]);

	return (
		<FormControl fullWidth margin='normal'>
			<InputLabel id='to-calendar-list-label'>
				{t("ImportModules.ToCalendarSelect.label")}
			</InputLabel>
			<Select
				{...register("toCalendar")}
				disabled={disabled}
				error={!!errorMessage}
				onChange={onChange}
				value={value}
				required
				name='toCalendar'
				labelId='to-calendar-list-label'
				label={t("ImportModules.ToCalendarSelect.label")}
				margin='dense'
			>
				{calendars.map((calendar) => (
					<MenuItem value={calendar.id} key={calendar.id}>
						{calendar.summary}
					</MenuItem>
				))}
			</Select>
			<FormHelperText>{errorMessage}</FormHelperText>
		</FormControl>
	);
});

export default ToCalendarSelect;
