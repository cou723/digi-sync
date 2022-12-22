import {FormControl, TextField, Stack} from "@mui/material";
import {ChangeEvent} from "react";

type Props = {
    username: string;
    password: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function DHUPortalData({username, password, onChange}: Props) {
    return (
        <Stack spacing={1}>
            <TextField onChange={onChange} value={username} required name="username" id="standard-basic" label="デジキャン ユーザーネーム" variant="standard" />
            <TextField type="password" onChange={onChange} value={password} required name="password" id="standard-basic" label="デジキャン パスワード" variant="standard" />
        </Stack>
    );
}
