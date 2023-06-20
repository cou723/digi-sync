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
import { CalendarList, CalendarListEntry } from 'types/gapiCalendar'

type Props = {
    register: any
    disabled: boolean
    errorMessage: string
    value: string
    onChange: (event: SelectChangeEvent<string>, child: ReactNode) => void
    setAccessToken: (accessToken: string) => void
}

const ToCalendar = ({
    register,
    disabled,
    errorMessage,
    value,
    onChange,
    setAccessToken,
}: Props) => {
    const [calendars, setCalendars] = useState<Array<CalendarListEntry>>([])
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
            const calendar_list_entry: CalendarList = data

            const my_calendar_list = calendar_list_entry.items.filter((calendar) => calendar.accessRole === 'owner')
            setCalendars(my_calendar_list)
            setAccessToken(session.accessToken)
        })()
    }, [session, setAccessToken])

    return (
        <FormControl fullWidth margin='normal'>
            <InputLabel id='to-calendar-list-label'>インポート先カレンダー</InputLabel>
            <Select
                {...register('toCalendar')}
                disabled={disabled}
                error={!!errorMessage}
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
            <FormHelperText>{errorMessage}</FormHelperText>
        </FormControl>
    )
}

export default ToCalendar
