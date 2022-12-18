import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

export default function ImportRange() {
    return (
        <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">読み込む範囲</FormLabel>
            <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="1" name="import">
                <FormControlLabel value="1" control={<Radio />} label="前期" />
                <FormControlLabel value="2" control={<Radio />} label="後期" />
            </RadioGroup>
        </FormControl>
    );
}
