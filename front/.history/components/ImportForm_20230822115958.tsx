import { yupResolver } from "@hookform/resolvers/yup";
import { SelectChangeEvent, Stack, Button, LinearProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Digican } from "../libs/digican";
import {
	FORM_STATE_DEFAULT_VALUE,
	getSelectableYearList,
	FORM_SCHEMA_SHAPE,
} from "../libs/importFormCommons";
import { GoogleFormInputs } from "../types/formInputsTypes";
import { RawClassEvent } from "../types/types";
import AllDeleteButton from "./importModules/AllDeleteButton";
import ImportOptions from "./importModules/ImportOptions";
import ImportRangeSelect from "./importModules/ImportRangeSelect";
import ImportYearSelect from "./importModules/ImportYearSelect";
import RhfTextField from "./importModules/RhfTextField";
import ToCalendarSelect from "./importModules/ToCalendarSelect";
import useBeforeUnload from "hooks/import-hook";

const FORM_STATE_DEFAULT_VALUE_FOR_GOOGLE: GoogleFormInputs = {
	...FORM_STATE_DEFAULT_VALUE,
	toCalendar: "",
} as GoogleFormInputs;

export default function ImportForm() {
	const { t } = useTranslation("components");
	const { t: ct } = useTranslation("common");
	const schema = yup.object().shape({
		...FORM_SCHEMA_SHAPE,
		toCalendar: yup.string().required(t("ImportForm.choose_calendar")),
	});
	const [formState, setFormState] = useState<GoogleFormInputs>(
		FORM_STATE_DEFAULT_VALUE_FOR_GOOGLE,
	);
	const [accessToken, setAccessToken] = useState<string>("");
	const [importCount, setImportCount] = useState<number>(0);
	const [totalImportCount, setTotalImportCount] = useState<number>(0);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<GoogleFormInputs>({
		resolver: yupResolver(schema),
	});

	const [appState, setAppState] = useState<
		"unauthenticated" | "ready" | "connect portal" | "import"
	>("unauthenticated");

	useBeforeUnload(appState);

	const selectableYears: Array<number> = getSelectableYearList();

	const { data: session, status: authStatus } = useSession();

	useEffect(() => {
		if (authStatus == "unauthenticated") setAppState("unauthenticated");
		else setAppState("ready");
	}, [authStatus]);

	const handleSelectChange = (event: SelectChangeEvent<string>) => {
		const value = event.target.value;
		setFormState({
			...formState,
			[event.target.name]: value,
		});
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.name == "ignoreOtherEvents") {
			setFormState({
				...formState,
				[event.target.name]: event.target.checked,
			});
		} else {
			setFormState({
				...formState,
				[event.target.name]: event.target.value,
			});
		}
	};

	const onSubmit = async (inputs: GoogleFormInputs) => {
		setAppState("connect portal");

		let class_event_list: RawClassEvent[];
		try {
			inputs.importYear = formState.importYear;
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
		<Stack spacing={2} component='form' action='/import'>
			<ImportYearSelect
				register={register}
				value={formState.importYear}
				appState={appState}
				selectableYears={selectableYears}
				onChange={handleSelectChange}
			/>
			<ImportRangeSelect
				register={register}
				disabled={appState != "ready"}
				errorMessage={errors.importRange?.message}
				value={formState.importRange}
				onChange={handleSelectChange}
			/>
			<ToCalendarSelect
				register={register}
				disabled={appState != "ready"}
				errorMessage={errors.toCalendar?.message}
				value={formState.toCalendar}
				onChange={handleSelectChange}
				setAccessToken={setAccessToken}
			/>
			<Stack spacing={1}>
				<RhfTextField
					name='username'
					disabled={appState != "ready"}
					register={register}
					error_message={errors.username?.message}
					onChange={handleInputChange}
					value={formState.username}
					label={ct("digican_username")}
				/>
				<RhfTextField
					name='password'
					type='password'
					disabled={appState != "ready"}
					register={register}
					error_message={errors.password?.message}
					onChange={handleInputChange}
					value={formState.password}
					label={ct("digican_password")}
				/>
			</Stack>
			<ImportOptions
				register={register}
				disabled={appState != "ready"}
				value={formState.ignoreOtherEvents}
				onChange={handleInputChange}
			/>
			<input type='hidden' name='accessToken' value={accessToken} />
			<br />
			<Button
				sx={{ textTransform: "none" }}
				disabled={appState !== "ready"}
				variant='contained'
				type='submit'
				onClick={handleSubmit(onSubmit)}
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
				variant='determinate'
				value={appState == "import" ? (importCount / totalImportCount) * 100 : 0}
			/>
			{appState == "import" ? `${t("ImportForm.importing")}...` : ""}
			<AllDeleteButton disabled={appState == "unauthenticated"} />
		</Stack>
	);
}
