import { TextField } from '@mui/material'
import React from 'react'

type Props = {
    name: string
    type?: string
    disabled?: boolean
    register: any
    error_message?: string
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    value: string
    label?: string
}

export default React.memo(function RhfTextField({
    name,
    type = 'text',
    disabled = false,
    register,
    error_message,
    onChange,
    value,
    label = '',
}: Props) {
    return (
        <TextField
            {...register(name, { required: true })}
            disabled={disabled}
            error={!!error_message}
            type={type}
            onChange={onChange}
            value={value}
            required
            name={name}
            id='standard-basic'
            label={label}
            variant='standard'
            helperText={error_message}
        />
    )
})
