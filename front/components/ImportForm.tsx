import { yupResolver } from "@hookform/resolvers/yup";
import { SelectChangeEvent, Stack, Button, LinearProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
    fetchClassEventList,
    FORM_STATE_DEFAULT_VALUE,
    getSelectableYearList,
    FORM_SCHEMA_SHAPE,
} from "../libs/importFormCommons";
import { GoogleFormInputs } from "../types/formInputsTypes";
import { RawClassEvent } from "../types/types";
import AllDeleteButton from "./ImportModules/AllDeleteButton";
import ImportOptions from "./ImportModules/ImportOptions";
import ImportRangeSelect from "./ImportModules/ImportRangeSelect";
import ImportYearSelect from "./ImportModules/ImportYearSelect";
import RhfTextField from "./ImportModules/RhfTextField";
import ToCalendarSelect from "./ImportModules/ToCalendarSelect";
import useBeforeUnload from "hooks/import-hook";
import { postToGoogleCalendar } from "types/googleCalendar";

const FORM_STATE_DEFAULT_VALUE_FOR_GOOGLE: GoogleFormInputs = {
    ...FORM_STATE_DEFAULT_VALUE,
    toCalendar: "",
} as GoogleFormInputs;

export default function ImportForm() {
    const { t } = useTranslation("common");
    const schema = yup.object().shape({
        ...FORM_SCHEMA_SHAPE,
        toCalendar: yup.string().required(t("importForm.toCalendar.choose_calendar")),
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
        const value = event.target.value;
        setFormState({
            ...formState,
            [event.target.name]: value,
        });
    };

    const onSubmit = async (inputs: GoogleFormInputs) => {
        setAppState("connect portal");

        let class_event_list: RawClassEvent[];
        try {
            inputs.importYear = formState.importYear;
            class_event_list = await fetchClassEventList(
                inputs,
                t("components.ImportModules.cannot_connect_digican"),
            );
        } catch (e) {
            setAppState("ready");
            return;
        }

        setAppState("import");
        let class_events: RawClassEvent[] = class_event_list;
        if (inputs.ignoreOtherEvents) {
            class_events = class_event_list.filter(
                (class_event) => class_event.className.indexOf("eventJugyo") !== -1,
            );
        }

        // class_events = excludeOutOfImportRange(inputs, class_events)
        await postToGoogleCalendar(
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
                    label={t("common.digican_username")}
                />
                <RhfTextField
                    name='password'
                    type='password'
                    disabled={appState != "ready"}
                    register={register}
                    error_message={errors.password?.message}
                    onChange={handleInputChange}
                    value={formState.password}
                    label={t("common.digican_password")}
                />
            </Stack>
            <ImportOptions
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
                {appState == "connect portal"
                    ? `${t("components.ImportForm.loading_from_digican")}...`
                    : ""}
                {appState == "import"
                    ? `(${importCount} ${t("common.unit")}/${totalImportCount} ${t("common.unit")})`
                    : ""}
                {appState == "unauthenticated"
                    ? t("components.ImportForm.please_log_in_with_google")
                    : t("components.ImportForm.sync_google_calendar")}
            </Button>

            <LinearProgress
                style={{ display: appState == "import" ? "inline" : "none" }}
                variant='determinate'
                value={appState == "import" ? (importCount / totalImportCount) * 100 : 0}
            />
            {appState == "import" ? `${t("components.ImportForm.importing")}...` : ""}
            <AllDeleteButton disabled={appState == "unauthenticated"} />
        </Stack>
    );
}
