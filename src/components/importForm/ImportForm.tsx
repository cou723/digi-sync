// TODO: このファイル自体結構謎、ImportForm/index.tsxが別にあるため、このファイルはいったい何・・・？なんか、どこでも使われてなさそう

import { yupResolver } from "@hookform/resolvers/yup";
import { Stack, Button, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import AllDeleteButton from "@/components/importFormCommon/allDeleteButton";
import ImportOptions from "@/components/importFormCommon/importOptions";
import ImportRangeSelect from "@/components/importFormCommon/importRangeSelect";
import ImportYearSelect from "@/components/importFormCommon/importYearSelect";
import RhfTextField from "@/components/utils/rhfTextField";
import useBeforeUnload from "@/hooks/useBeforeUnload";
import { useCustomSession } from "@/hooks/useCustomSession";
import { Digican } from "@/libs/digican";
import { GoogleCalendar } from "@/libs/googleCalendar";
import { FORM_SCHEMA_SHAPE } from "@/libs/importFormCommons";
import { getNowAcademicYear } from "@/libs/utils";
import { GoogleFormInputs } from "@/types/formInputsTypes";
import { RawClassEvent } from "@/types/types";

import ToCalendarSelect from "./toCalendarSelect";

import { ImportFormState } from ".";

export default function ImportForm() {
	// TODO: custom hookしたい -----------------------------ここから
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

	// TODO: result追加してもうちょっと分かりやすくエラーハンドリングしたい気持ち
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
		console.log(classEventList);

		setAppState("import");
		let classEvents: RawClassEvent[] = classEventList;
		if (inputs.ignoreOtherEvents) {
			classEvents = classEvents.filter((classEvent) =>
				classEvent.className.includes("eventJugyo"),
			);
		}

		// class_events = excludeOutOfImportRange(inputs, class_events)
		await GoogleCalendar.post(
			session,
			classEvents,
			setImportCount,
			setTotalImportCount,
			inputs,
		);

		setAppState("ready");
	};

	// ---------------------------------------------------ここまで

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
				<RhfTextField
					disabled={appState != "ready"}
					error_message={errors.username?.message}
					label='デジキャンのユーザーネーム(学籍番号)'
					name='username'
					register={register}
				/>
				<RhfTextField
					disabled={appState != "ready"}
					error_message={errors.password?.message}
					label='デジキャンのパスワード'
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
				{appState == "connect portal" ? "インポート中" : ""}
				{appState == "import" ? `(${importCount} 件/${totalImportCount} 件)` : ""}
				{appState == "unauthenticated"
					? "グーグルアカウントにログインしてください"
					: "Googleカレンダーへインポート"}
			</Button>

			{appState == "import" ? (
				<LinearProgress
					value={(importCount / totalImportCount) * 100}
					variant='determinate'
				/>
			) : (
				""
			)}

			{appState == "import" ? "インポート中" : ""}
			<AllDeleteButton disabled={appState == "unauthenticated"} />
		</Stack>
	);
}
