import {useSession, signIn, signOut} from "next-auth/react";
import {FormControl, Select, MenuItem, InputLabel} from "@mui/material";
export default function Component() {
    return (

            <FormControl fullWidth margin="dense">
                <InputLabel id="import-q-label">インポートするクオーター</InputLabel>
                <Select labelId="import-q-label" label="インポートするクオーター">
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    <MenuItem value="3">3</MenuItem>
                    <MenuItem value="4">4</MenuItem>
                </Select>
            </FormControl>

    );
}
