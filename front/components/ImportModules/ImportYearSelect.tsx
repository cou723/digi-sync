import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { FormInputs } from 'types/formInputsTypes'

type Props = {
    register: any
    appState: string
    value: string
    onChange: (event: any) => void
    selectableYears: number[]
}

export default function ImportYear({
    register,
    appState,
    value,
    onChange,
    selectableYears,
}: Props) {
    return (
        <FormControl margin='normal'>
            <InputLabel id='import-year-label'>インポート年度</InputLabel>
            <Select
                {...register('importYear', { required: true, valueAsNumber: true })}
                disabled={appState != 'ready'}
                value={value}
                onChange={onChange}
                name='importYear'
                labelId='import-year-label'
                label='インポート年度'
                margin='dense'
            >
                {selectableYears.map((selectableYear: number, i: number) => (
                    <MenuItem value={selectableYear} key={i}>
                        {selectableYear}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
