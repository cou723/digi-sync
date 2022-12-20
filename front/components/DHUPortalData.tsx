import {FormControl, TextField, MenuItem, InputLabel} from "@mui/material";

export default function DHUPortalData() {
    return (
        <FormControl fullWidth margin="dense">
            <TextField id="standard-basic" label="デジキャン ユーザーネーム" variant="standard" />
            <TextField id="standard-basic" label="デジキャン パスワード" variant="standard" />
        </FormControl>
    );
}
