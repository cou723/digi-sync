import { Checkbox, FormControlLabel } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";

type Props = {
    disabled?: boolean;
    value: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
};

const ImportOptions = React.memo(function ImportOptions({
    disabled = false,
    value,
    onChange,
}: Props) {
    const { t } = useTranslation("common");
    return (
        <FormControlLabel
            disabled={disabled}
            control={
                <Checkbox
                    value={value}
                    onChange={onChange}
                    required
                    name='ignoreOtherEvents'
                    defaultChecked
                />
            }
            label={t("components.importModules.importOptions.label")}
        />
    );
});

export default ImportOptions;
