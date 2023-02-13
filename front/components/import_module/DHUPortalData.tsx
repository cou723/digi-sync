import {FormControl, TextField, Stack, FormHelperText} from "@mui/material";
import {ChangeEvent} from "react";

type Props = {
    disable: boolean;
    error: Error;
    username: string;
    password: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

type Error = {
    username: string;
    password: string;
};

export default function DHUPortalData({disable, error, username, password, onChange}: Props) {
    return (
        <Stack spacing={1}>
            <TextField disabled={disable} error={error.username != ""} onChange={onChange} value={username} required name="username" id="standard-basic" label="デジキャン ユーザーネーム" variant="standard" />
            <FormHelperText>{error.username}</FormHelperText>
            <TextField disabled={disable} error={error.password != ""} type="password" onChange={onChange} value={password} required name="password" id="standard-basic" label="デジキャン パスワード" variant="standard" />
            <FormHelperText>{error.password}</FormHelperText>
        </Stack>
    );
}
