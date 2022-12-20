import {FormControl, TextField,Stack} from "@mui/material";

export default function DHUPortalData() {
    return (
        <Stack>
            <TextField name="portal_username" id="standard-basic" label="デジキャン ユーザーネーム" variant="standard" />
            <TextField name="portal_password" id="standard-basic" label="デジキャン パスワード" variant="standard" />
        </Stack>
    );
}
