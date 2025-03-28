import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import DigicanPasswordInput from "@/components/importForm/DigicanPasswordInput";
import DigicanUsernameInput from "@/components/importForm/DigicanUsernameInput";
import ExecuteButton from "@/components/importFormCommon/ExecuteButton";
import ImportOptions from "@/components/importFormCommon/importOptions";
import ImportRangeSelect from "@/components/importFormCommon/importRangeSelect";
import ImportYearSelect from "@/components/importFormCommon/importYearSelect";
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
	// TODO: ./importForm/index.tsxと共通同じくカスタムフックにした方がいい
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormInputs>({
		resolver: yupResolver(schema),
	});

	const [appState, setAppState] = useState<"ready" | "connect portal">("ready");

	// 特にここのロジックはかなり再利用したい
	const onSubmit = async (inputs: FormInputs) => {
		setAppState("connect portal");
		let classEventList: RawClassEvent[];
		// TODO: resultの導入によってもっとわかりやすくしたい
		try {
			classEventList = await Digican.fetchClassEvents(
				inputs,
				"デジキャンに接続できませんでした(ユーザーネーム、パスワードがあっているか今一度お確かめください)",
			);
		} catch (e: unknown) {
			if (e instanceof Error) alert(e.message);
			console.log(e);
			setAppState("ready");
			return;
		}
		try {
			const IcalTimeTable = convertToIcalMap(classEventList);
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
				<DigicanUsernameInput appState={appState} errors={errors} register={register} />
				<DigicanPasswordInput appState={appState} errors={errors} register={register} />
			</Stack>
			<ImportOptions control={control} disabled={appState != "ready"} register={register} />
			<br />
			<ExecuteButton IsIcal={true} appState={appState} onClick={handleSubmit(onSubmit)} />
		</Stack>
	);
}
