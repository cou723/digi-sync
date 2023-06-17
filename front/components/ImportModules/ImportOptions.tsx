import { Checkbox, FormControlLabel } from '@mui/material'

type Props = {
    disabled: boolean
    value: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
}

export default function ImportOptions({ disabled, value, onChange }: Props) {
    return (
        <FormControlLabel
            disabled={disabled}
            control={
                <Checkbox
                    value={value}
                    onChange={onChange}
                    required
                    name='ignoreOtherEvents'
                    defaultChecked
                />
            }
            label='授業以外をインポートしない'
        />
    )
}
