import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material'
import { signOut, useSession } from 'next-auth/react'
import React, { ReactNode, useEffect, useState } from 'react'

type Calendar = {
    id: string
    summary: string
}

type Props = {
    disabled: boolean
    error: string
    value: string
    onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void
    setAccessToken: (accessToken: string) => void
}

const ToCalendar = ({ disabled, error, value, onChange, setAccessToken }: Props) => {
    const [calendars, setCalendars] = useState<Array<Calendar>>([])
    const { data: session } = useSession()

    useEffect(() => {
        ;(async () => {
            let res: Response
            try {
                if (!(session && session.user)) return
                res = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${session.accessToken}` },
                })
            } catch (e) {
                console.error(e)
                return
            }
            const data = await res.json()
            if (data.error !== undefined && data.error.code >= 400) {
                signOut()
                return
            }
            setCalendars(data.items)
            setAccessToken(session.accessToken)
        })()
    }, [session, setAccessToken])

    return (
        <FormControl fullWidth margin='normal'>
            <InputLabel id='to-calendar-list-label'>インポート先カレンダー</InputLabel>
            <Select
                disabled={disabled}
                error={error != ''}
                onChange={onChange}
                value={value}
                required
                name='toCalendar'
                labelId='to-calendar-list-label'
                label='インポート先カレンダー'
                margin='dense'
            >
                {calendars.map((calendar) => (
                    <MenuItem value={calendar.id} key={calendar.id}>
                        {calendar.summary}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{error}</FormHelperText>
        </FormControl>
    )
}

export default ToCalendar
