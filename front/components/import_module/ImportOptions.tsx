import {Checkbox, FormControlLabel} from "@mui/material";

type Props = {
    disable:boolean;
    value: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
};

export default function ImportOptions({disable, value, onChange}: Props) {
    return (
            <FormControlLabel disabled={disable} control={<Checkbox value={value} onChange={onChange} required name="ignoreOtherEvents" defaultChecked />} label="授業以外をインポートしない" />
    );
}
