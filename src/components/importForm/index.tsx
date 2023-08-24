import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Button, LinearProgress } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import useBeforeUnload from "@/hooks/importHook";
import { useCustomSession } from "@/hooks/useCustomSession";
import { Digican } from "@/libs/digican";
import { GoogleCalendar } from "@/libs/googleCalendar";
import {
	FORM_SCHEMA_SHAPE,
} from "@/libs/importFormCommons";
import { getNowAcademicYear } from "@/libs/utils";
import { GoogleFormInputs } from "@/types/formInputsTypes";
import { RawClassEvent } from "@/types/types";

import AllDeleteButton from "../importFormCommon/allDeleteButton";
import ImportOptions from "../importFormCommon/importOptions";
import ImportRangeSelect from "../importFormCommon/importRangeSelect";
import ImportYearSelect from "../importFormCommon/importYearSelect";
import RhfTextField from "../utils/rhfTextField";

import ToCalendarSelect from "./toCalendarSelect";

export type ImportFormState = "unauthenticated" | "ready" | "connect portal" | "import";

export default function ImportForm() {
	const { t } = useTranslation("components");
	const { t: ct } = useTranslation("common");
	const schema = yup.object().shape({
		...FORM_SCHEMA_SHAPE,
		toCalendar: yup.string().required(t("ImportForm.choose_calendar")),
	});

	const [importCount, setImportCount] = useState<number>(0);
	const [totalImportCount, setTotalImportCount] = useState<number>(0);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<GoogleFormInputs>({
		defaultValues: {
			ignoreOtherEvents: true,
			importYear: getNowAcademicYear().toString(),
		},
		resolver: yupResolver<GoogleFormInputs>(schema),
	});

	const [appState, setAppState] = useState<ImportFormState>("unauthenticated");

	useBeforeUnload(appState);

	const { session, authStatus } = useCustomSession();

	useEffect(() => {
		if (authStatus == "unauthenticated") setAppState("unauthenticated");
		else setAppState("ready");
	}, [authStatus]);

	const onSubmit = async (inputs: GoogleFormInputs): Promise<void> => {
		setAppState("connect portal");

		let class_event_list: RawClassEvent[];
		try {
			class_event_list = await Digican.fetchClassEvents(
				inputs,
				t("components.importModules.cannot_connect_digican"),
			);
		} catch (e) {
			alert(t("ImportForm.cannot_connect_digican"));
			console.log(e);
			setAppState("ready");
			return;
		}

		setAppState("import");
		let class_events: RawClassEvent[] = class_event_list;
		if (inputs.ignoreOtherEvents) {
			class_events = class_events.filter((class_event) =>
				class_event.className.includes("eventJugyo"),
			);
		}

		// class_events = excludeOutOfImportRange(inputs, class_events)
		await GoogleCalendar.post(
			session,
			class_events,
			setImportCount,
			setTotalImportCount,
			inputs,
		);

		setAppState("ready");
	};

	return (
		<Stack action='/import' component='form' spacing={2}>
			<ImportYearSelect
				appState={appState}
				control={control}
			/>
			<ImportRangeSelect
				control={control}
				disabled={appState != "ready"}
			/>
			<ToCalendarSelect
				control={control}
				disabled={appState != "ready"}
				errorMessage={errors.toCalendar?.message}
			/>
			<Stack spacing={1}>
				<RhfTextField
					disabled={appState != "ready"}
					error_message={errors.username?.message}
					label={ct("digican_username")}
					name='username'
					register={register}
				/>
				<RhfTextField
					disabled={appState != "ready"}
					error_message={errors.password?.message}
					label={ct("digican_password")}
					name='password'
					register={register}
					type='password'
				/>
			</Stack>
			<ImportOptions control={control} disabled={appState != "ready"} register={register} />
			<input
				name='accessToken'
				type='hidden'
				value={authStatus === "authenticated" ? session.accessToken : undefined}
			/>
			<br />
			<Button
				disabled={appState !== "ready"}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onClick={handleSubmit(onSubmit, (errors: any) => {
					console.log(errors);
				})}
				sx={{ textTransform: "none" }}
				type='submit'
				variant='contained'
			>
				{appState == "connect portal" ? `${t("ImportForm.loading_from_digican")}...` : ""}
				{appState == "import"
					? `(${importCount} ${ct("unit")}/${totalImportCount} ${ct("unit")})`
					: ""}
				{appState == "unauthenticated"
					? t("ImportForm.please_log_in_with_google")
					: t("ImportForm.sync_google_calendar")}
			</Button>

			<LinearProgress
				style={{ display: appState == "import" ? "inline" : "none" }}
				value={appState == "import" ? (importCount / totalImportCount) * 100 : 0}
				variant='determinate'
			/>
			{appState == "import" ? `${t("ImportForm.importing")}...` : ""}
			<AllDeleteButton disabled={appState == "unauthenticated"} />
		</Stack>
	);
}
