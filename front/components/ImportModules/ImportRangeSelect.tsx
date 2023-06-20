import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { ReactNode } from "react";
import { UseFormRegister } from "react-hook-form";
import { FormInputs, GoogleFormInputs } from "types/formInputsTypes";

type Props = {
    register: UseFormRegister<FormInputs> | UseFormRegister<GoogleFormInputs>;
    disabled?: boolean;
    errorMessage: string;
    value: string;
    onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void;
};

const ImportRangeSelect = React.memo(function ImportRangeSelect({
    register,
    disabled = false,
    errorMessage,
    value,
    onChange,
}: Props) {
    const { t } = useTranslation();
    return (
        <FormControl fullWidth margin='normal'>
            <InputLabel id='import-q-label'>
                {t("components.ImportModules.ImportRangeSelect.label")}
            </InputLabel>
            <Select
                {...register("importRange")}
                disabled={disabled}
                error={!!errorMessage}
                onChange={onChange}
                value={value}
                required
                name='importRange'
                labelId='import-q-label'
                label={t("components.ImportModules.ImportRangeSelect.label")}
                margin='dense'
            >
                <MenuItem value='1q'>
                    {t("components.ImportModules.ImportRangeSelect.first_quarter")}
                </MenuItem>
                <MenuItem value='2q'>
                    {t("components.ImportModules.ImportRangeSelect.second_quarter")}
                </MenuItem>
                <MenuItem value='3q'>
                    {t("components.ImportModules.ImportRangeSelect.third_quarter")}
                </MenuItem>
                <MenuItem value='4q'>
                    {t("components.ImportModules.ImportRangeSelect.fourth_quarter")}
                </MenuItem>
                <MenuItem value='1q_and_2q'>{t("common.first_semester")}</MenuItem>
                <MenuItem value='3q_and_4q'>{t("common.second_semester")}</MenuItem>
            </Select>
            <FormHelperText>{errorMessage}</FormHelperText>
        </FormControl>
    );
});
export default ImportRangeSelect;
