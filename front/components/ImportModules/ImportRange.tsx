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
    disabled: boolean
    error: string
    value: string
    onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void
}

export default function Component({ disabled, error, value, onChange }: Props) {
    return (
        <FormControl fullWidth margin='normal'>
            <InputLabel id='import-q-label'>インポートするクオーター</InputLabel>
            <Select
                disabled={disabled}
                error={error != ''}
                onChange={onChange}
                value={value}
                required
                name='importRange'
                labelId='import-q-label'
                label='インポートするクオーター'
                margin='dense'
            >
                <MenuItem value='1q'>1クオーター</MenuItem>
                <MenuItem value='2q'>2クオーター</MenuItem>
                <MenuItem value='3q'>3クオーター</MenuItem>
                <MenuItem value='4q'>4クオーター</MenuItem>
                <MenuItem value='1q_and_2q'>前期</MenuItem>
                <MenuItem value='3q_and_4q'>後期</MenuItem>
            </Select>
            <FormHelperText>{error}</FormHelperText>
        </FormControl>
    )
}
