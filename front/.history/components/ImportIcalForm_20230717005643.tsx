import { yupResolver } from "@hookform/resolvers/yup";
import { SelectChangeEvent, Stack, Button } from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
	fetchClassEventList,
	FORM_SCHEMA_SHAPE,
	FORM_STATE_DEFAULT_VALUE,
	getSelectableYearList,
} from "../libs/importFormCommons";
import { ConvertToIcalMap } from "../libs/table-to-ical/ConvertToIcal";
import { DownloadBrowser } from "../libs/table-to-ical/DownloadBrowser";
import { FormInputs } from "../types/formInputsTypes";
import { RawClassEvent } from "../types/types";
import ImportOptions from "./ImportModules/ImportOptions";
import ImportRangeSelect from "./ImportModules/ImportRangeSelect";
import ImportYearSelect from "./ImportModules/ImportYearSelect";
import RhfTextField from "./ImportModules/RhfTextField";

export interface API_RETURN_EventList {
	events: RawClassEvent[];
}

const schema = yup.object().shape(FORM_SCHEMA_SHAPE);

export function ImportIcalForm() {
	const { t } = useTranslation("components");
	const { t: cc } = useTranslation("common");
	const [formState, setFormState] = useState<FormInputs>(FORM_STATE_DEFAULT_VALUE);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInputs>({
		resolver: yupResolver(schema),
	});

	const [appState, setAppState] = useState<"ready" | "connect portal">("ready");

	const selectableYears: Array<number> = getSelectableYearList();

	const handleSelectChange = (event: SelectChangeEvent<string>) => {
		const value = event.target.value;
		setFormState({
			...formState,
			[event.target.name]: value,
		});
	};

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setFormState({
			...formState,
			[event.target.name]: value,
		});
	};

	const onSubmit = async (inputs: FormInputs) => {
		setAppState("connect portal");
		let class_event_list: RawClassEvent[];
		try {
			class_event_list = await fetchClassEventList(
				inputs,
				t("ImportForm.cannot_connect_digican"),
			);
		} catch (e: any) {
			alert(e.message);
			console.log(e);
			setAppState("ready");
			return;
		}
		const IcalTimeTable: any = ConvertToIcalMap(class_event_list);
		if (IcalTimeTable != null) DownloadBrowser(IcalTimeTable);
		setAppState("ready");
	};

	return (
		<Stack spacing={2} component='form' autoComplete='off' action='/import'>
			<ImportYearSelect
				register={register}
				value={formState.importYear}
				appState={appState}
				selectableYears={selectableYears}
				onChange={handleSelectChange}
			/>
			<ImportRangeSelect
				register={register}
				errorMessage={errors.importRange?.message}
				value={formState.importRange}
				onChange={handleSelectChange}
			/>
			<Stack spacing={1}>
				<RhfTextField
					name='username'
					disabled={appState != "ready"}
					register={register}
					error_message={errors.username?.message}
					onChange={handleInputChange}
					value={formState.username}
					label={cc("digican_username")}
				/>
				<RhfTextField
					name='password'
					type='password'
					disabled={appState != "ready"}
					register={register}
					error_message={errors.password?.message}
					onChange={handleInputChange}
					value={formState.password}
					label={cc("digican_password")}
				/>
			</Stack>
			<ImportOptions
				register={register}
				value={formState.ignoreOtherEvents}
				onChange={handleInputChange}
			/>
			<br />
			<Button
				sx={{ textTransform: "none" }}
				disabled={appState == "connect portal"}
				variant='contained'
				onClick={handleSubmit(onSubmit)}
			>
				{appState == "connect portal"
					? t("ImportForm.importing") + "..."
					: t("ImportForm.download_with_ical")}
			</Button>
		</Stack>
	);
}
