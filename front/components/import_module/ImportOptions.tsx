import {Checkbox, FormControlLabel} from "@mui/material";

type Props = {
    value: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
};

export default function ImportOptions({value, onChange}: Props) {
    return (
        <>
            <FormControlLabel control={<Checkbox value={value} onChange={onChange} required name="ignore_other_event" defaultChecked />} label="授業以外をインポートしない" />
        </>
    );
}
