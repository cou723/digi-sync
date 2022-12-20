import {Checkbox, FormControlLabel, MenuItem, FormControl, InputLabel} from "@mui/material";
export default function ImportOptions() {
    return (
        <>
            <FormControlLabel control={<Checkbox defaultChecked />} label="授業以外をインポートしない" />
        </>
    );
}
