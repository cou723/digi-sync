import { Checkbox, FormControlLabel } from '@mui/material'
import React from 'react'

type Props = {
    disabled?: boolean
    value: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
}


const ImportOptions = React.memo(function ImportOptions({ disabled = false, value, onChange }: Props) {
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
)

export default ImportOptions ;