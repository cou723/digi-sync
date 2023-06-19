import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material'
import { ReactNode } from 'react'

type Props = {
    register: any
    disabled?: boolean
    errorMessage: string
    value: string
    onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void
}

export default function Component({
    register,
    disabled = false,
    errorMessage,
    value,
    onChange,
}: Props) {
    return (
        <FormControl fullWidth margin='normal'>
            <InputLabel id='import-q-label'>インポートするクオーター</InputLabel>
            <Select
                {...register('importRange')}
                disabled={disabled}
                error={!!errorMessage}
                onChange={onChange}
                value={value}
                required
                name='importRange'
                labelId='import-q-label'
                label='インポートするクオーター'
                margin='dense'
            >
                <MenuItem value='1q'>1クオーター(4月～5月)</MenuItem>
                <MenuItem value='2q'>2クオーター(6月～8月)</MenuItem>
                <MenuItem value='3q'>3クオーター(9月～11月)</MenuItem>
                <MenuItem value='4q'>4クオーター(11月～3月)</MenuItem>
                <MenuItem value='1q_and_2q'>前期</MenuItem>
                <MenuItem value='3q_and_4q'>後期</MenuItem>
            </Select>
            <FormHelperText>{errorMessage}</FormHelperText>
        </FormControl>
    )
}
