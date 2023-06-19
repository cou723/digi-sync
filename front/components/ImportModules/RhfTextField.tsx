import React, { useState } from 'react'
import {TextField}from '@mui/material'

type Props = {
    name: string
    type?: string
    disabled?: boolean
    register: any
    error_message?: string
    onChange: any
    value: string
    label?:string
}

export function RhfTextField({
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
}
