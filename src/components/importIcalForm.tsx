import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Button } from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import ImportOptions from "@/components/importFormCommon/importOptions";
import ImportRangeSelect from "@/components/importFormCommon/importRangeSelect";
import ImportYearSelect from "@/components/importFormCommon/importYearSelect";
import RhfTextField from "@/components/utils/rhfTextField";
import { Digican } from "@/libs/digican";
import { FORM_SCHEMA_SHAPE } from "@/libs/importFormCommons";
import { convertToIcalMap } from "@/libs/table-to-ical/convertToIcal";
import { downloadBrowser } from "@/libs/table-to-ical/downloadBrowser";
import { FormInputs } from "@/types/formInputsTypes";
import { RawClassEvent } from "@/types/types";

export interface API_RETURN_EventList {
	events: RawClassEvent[];
}

const schema = yup.object().shape(FORM_SCHEMA_SHAPE);

export function ImportIcalForm() {
	const { t } = useTranslation("components");
	const { t: cc } = useTranslation("common");

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormInputs>({
		resolver: yupResolver(schema),
	});

	const [appState, setAppState] = useState<"ready" | "connect portal">("ready");

	const onSubmit = async (inputs: FormInputs) => {
		setAppState("connect portal");
		let class_event_list: RawClassEvent[];
		try {
			class_event_list = await Digican.fetchClassEvents(
				inputs,
				t("ImportForm.cannot_connect_digican"),
			);
		} catch (e: unknown) {
			if (e instanceof Error) alert(e.message);
			console.log(e);
			setAppState("ready");
			return;
		}
		try {
			const IcalTimeTable = convertToIcalMap(class_event_list);
			downloadBrowser(IcalTimeTable);
		} finally {
			setAppState("ready");
		}
	};

	return (
		<Stack action='/import' autoComplete='off' component='form' spacing={2}>
			<ImportYearSelect appState={appState} control={control} />
			<ImportRangeSelect control={control} disabled={appState != "ready"} />
			<Stack spacing={1}>
				<RhfTextField
					disabled={appState != "ready"}
					error_message={errors.username?.message}
					label={cc("digican_username")}
					name='username'
					register={register}
				/>
				<RhfTextField
					disabled={appState != "ready"}
					error_message={errors.password?.message}
					label={cc("digican_password")}
					name='password'
					register={register}
					type='password'
				/>
			</Stack>
			<ImportOptions control={control} disabled={appState != "ready"} register={register} />
			<br />
			<Button
				disabled={appState == "connect portal"}
				onClick={handleSubmit(onSubmit)}
				sx={{ textTransform: "none" }}
				variant='contained'
			>
				{appState == "connect portal"
					? t("ImportForm.importing") + "..."
					: t("ImportForm.download_with_ical")}
			</Button>
		</Stack>
	);
}
