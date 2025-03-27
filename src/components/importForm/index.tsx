import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import DigicanPasswordInput from "@/components/importForm/DigicanPasswordInput";
import DigicanUsernameInput from "@/components/importForm/DigicanUsernameInput";
import ImportingModal from "@/components/importForm/ImportingModal";
import TokenInput from "@/components/importForm/TokenInput";
import ExecuteButton from "@/components/importFormCommon/ExecuteButton";
import AllDeleteButton from "@/components/importFormCommon/allDeleteButton";
import ImportOptions from "@/components/importFormCommon/importOptions";
import ImportRangeSelect from "@/components/importFormCommon/importRangeSelect";
import ImportYearSelect from "@/components/importFormCommon/importYearSelect";
import useBeforeUnload from "@/hooks/useBeforeUnload";
import { useCustomSession } from "@/hooks/useCustomSession";
import { Digican } from "@/libs/digican";
import { GoogleCalendar } from "@/libs/googleCalendar";
import { FORM_SCHEMA_SHAPE } from "@/libs/importFormCommons";
import { getNowAcademicYear } from "@/libs/utils";
import { GoogleFormInputs } from "@/types/formInputsTypes";
import { RawClassEvent } from "@/types/types";

import ToCalendarSelect from "./toCalendarSelect";

export type ImportFormState = "unauthenticated" | "ready" | "connect portal" | "import";

export default function ImportForm() {
	const schema = yup.object().shape({
		...FORM_SCHEMA_SHAPE,
		toCalendar: yup.string().required("インポート先のカレンダーを選択してください"),
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
		resolver: yupResolver(schema),
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

		let classEventList: RawClassEvent[];
		try {
			classEventList = await Digican.fetchClassEvents(
				inputs,
				"デジキャンに接続できませんでした(ユーザーネーム、パスワードがあっているか今一度お確かめください)",
			);
		} catch (e) {
			console.log(e);
			// ユーザー名、パスワードが違い接続に失敗したのかデジキャンが落ちているのか判別できないため、同じエラー文を出す
			alert(
				"デジキャンに接続できませんでした(ユーザーネーム、パスワードがあっているか今一度お確かめください)",
			);
			setAppState("ready");
			return;
		}

		setAppState("import");
		let classEvents: RawClassEvent[] = classEventList;
		if (inputs.ignoreOtherEvents) {
			classEvents = classEvents.filter((classEvent) =>
				classEvent.className.includes("eventJugyo"),
			);
		}

		await GoogleCalendar.post(
			session,
			classEvents,
			setImportCount,
			setTotalImportCount,
			inputs,
		);

		setAppState("ready");
	};

	return (
		<Stack action='/import' component='form' spacing={2}>
			<ImportYearSelect appState={appState} control={control} />
			<ImportRangeSelect control={control} disabled={appState != "ready"} />
			<ToCalendarSelect
				control={control}
				disabled={appState != "ready"}
				errorMessage={errors.toCalendar?.message}
			/>
			<Stack spacing={1}>
				<DigicanUsernameInput appState={appState} errors={errors} register={register} />
				<DigicanPasswordInput appState={appState} errors={errors} register={register} />
			</Stack>
			<ImportOptions control={control} disabled={appState != "ready"} register={register} />

			<TokenInput />
			<br />

			<ExecuteButton
				appState={appState}
				onClick={handleSubmit(onSubmit, (errors: any) => {
					console.log(errors);
				})}
			/>

			<AllDeleteButton disabled={appState == "unauthenticated"} />
			<ImportingModal
				imported={importCount}
				isOpen={appState == "connect portal" || appState == "import"}
				label={appState == "connect portal" ? "デジキャンに接続中です..." : undefined}
				total={totalImportCount}
			/>
		</Stack>
	);
}
