import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import GoogleSignInBtn from "./GoogleSignInBtn";

export default function ImportForm({isLogin}:{isLogin: boolean}) {
    let to_import;
    if(isLogin)
        to_import = <div></div>;
    else
        to_import = <GoogleSignInBtn></GoogleSignInBtn>
    return (
        <Container>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">インポートするクオーター</InputLabel>
                <Select labelId="demo-simple-select-label" id="demo-simple-select" label="インポートするクオーター" /* onChange={handleChange} */>
                    <MenuItem value={1}>1クオーター</MenuItem>
                    <MenuItem value={2}>2クオーター</MenuItem>
                    <MenuItem value={3}>3クオーター</MenuItem>
                    <MenuItem value={4}>4クオーター</MenuItem>
                </Select>
                <InputLabel id="demo-simple-select-label">インポート先のカレンダー</InputLabel>
                {to_import}
                <InputLabel id="demo-simple-select-label">学籍番号</InputLabel>
                <InputLabel id="demo-simple-select-label">デジキャンのパスワード</InputLabel>
                <InputLabel id="demo-simple-select-label">授業のみをインポートする</InputLabel>
            </FormControl>
        </Container>
    );
}
