import { zodResolver } from '@hookform/resolvers/zod'
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    FormHelperText,
    TextField,
} from '@mui/material'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
    excludeOutOfImportRange,
    fetchClassEventList,
    INIT_REQUIRE_VALUE_LIST,
    FORM_STATE_DEFAULT_VALUE,
    getSelectableYearList,
} from '../libs/importFormCommons'
import {
    encodeQueryData,
    getEndTime,
    GetEventsErrorObject,
    getQuarterRange,
    isGetEventErrorObject,
} from '../libs/utils'
import { GoogleFormInputs } from '../types/formInputs'
import type { CalendarList, Event } from '../types/gapiCalendar'
import { RawClassEvent } from '../types/types'
import AllDeleteButton from './ImportModules/AllDeleteButton'
import DHUPortalData from './ImportModules/DHUPortalData'
import ImportOptions from './ImportModules/ImportOptions'
import ImportRange from './ImportModules/ImportRange'
import ToCalendar from './ImportModules/ToCalendar'

const schema = z.object({
    importYear: z.number(),
    importRange: z.string().min(1,{message:"入力してください"}),
    toCalendar: z.string().min(1,{message:"入力してください"}),
    username: z.string().min(1,{message:"入力してください"}),
    password: z.string().min(1,{message:"入力してください"}),
    ignoreOtherEvents: z.boolean(),
})

type Schema = z.infer<typeof schema>

const FORM_STATE_DEFAULT_VALUE_FOR_GOOGLE: GoogleFormInputs = {
    ...FORM_STATE_DEFAULT_VALUE,
    toCalendar: '',
} as GoogleFormInputs

export default function ImportForm() {
    const [formState, setFormState] = useState<GoogleFormInputs>(
        FORM_STATE_DEFAULT_VALUE_FOR_GOOGLE,
    )
    const [accessToken, setAccessToken] = useState<string>('')
    const [importCount, setImportCount] = useState<number>(0)
    const [totalImportCount, setTotalImportCount] = useState<number>(0)

    const [importRangeError, setImportRangeError] = useState<string>('')
    const [calendarInputError, setCalendarInputError] = useState<string>('')
    const [dhuPortalInputError, setDhuPortalInputError] = useState({
        username: '',
        password: '',
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Schema>({
        resolver: zodResolver(schema),
    })

    const [appState, setAppState] = useState<
        'unauthenticated' | 'ready' | 'connect portal' | 'import'
    >('unauthenticated')

    const selectableYears: Array<number> = getSelectableYearList()

    const { data: session, status: authStatus } = useSession()

    useEffect(() => {
        if (authStatus == 'unauthenticated') setAppState('unauthenticated')
        else setAppState('ready')
    }, [authStatus])

    useEffect(() => {
        if (appState == 'import') {
            window.onbeforeunload = function () {
                return 'Are you sure you want to leave this page?'
            }
        } else {
            window.onbeforeunload = null
        }

        return () => {
            window.onbeforeunload = null
        }
    }, [appState])

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value
        setFormState({
            ...formState,
            [event.target.name]: value,
        })
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        console.log(errors);
        setFormState({
            ...formState,
            [event.target.name]: value,
        })
    }

    const onSubmit = async (inputs:Schema) => {
        console.log(inputs);

        let class_event_list: RawClassEvent[]
        try {
            class_event_list = await fetchClassEventList(inputs, setAppState)
        } catch (e) {
            setAppState('ready')
            return
        }
        setAppState('import')
        let class_events: RawClassEvent[] = class_event_list
        if (inputs.ignoreOtherEvents) {
            class_events = class_event_list.filter(
                (class_event) => class_event.className.indexOf('eventJugyo') !== -1,
            )
        }
        setImportCount(0)
        class_events = excludeOutOfImportRange(inputs, class_events)
        await postToGoogleCalendar(class_events)
        setAppState('ready')
    }

    function existsStateEmpty() {
        for (const input_label of Object.keys(formState)) {
            if (
                INIT_REQUIRE_VALUE_LIST.includes(input_label) &&
                FORM_STATE_DEFAULT_VALUE_FOR_GOOGLE[input_label] == formState[input_label]
            )
                return true
        }
        return false
    }

    function resetErrorMessage() {
        setImportRangeError(FORM_STATE_DEFAULT_VALUE_FOR_GOOGLE.importRange)
        setCalendarInputError(FORM_STATE_DEFAULT_VALUE_FOR_GOOGLE.toCalendar)
        setDhuPortalInputError({
            username: FORM_STATE_DEFAULT_VALUE_FOR_GOOGLE.username,
            password: FORM_STATE_DEFAULT_VALUE_FOR_GOOGLE.password,
        })
    }

    function setErrorMessages() {
        if (formState.importRange == FORM_STATE_DEFAULT_VALUE_FOR_GOOGLE.importRange) {
            setImportRangeError('インポート範囲が指定されていません')
        }
        if (formState.toCalendar == FORM_STATE_DEFAULT_VALUE_FOR_GOOGLE.toCalendar) {
            setCalendarInputError('インポート先のカレンダーが指定されていません')
        }
        let username_error_msg = ''
        if (formState.username == FORM_STATE_DEFAULT_VALUE_FOR_GOOGLE.username) {
            username_error_msg = 'ユーザー名を入力してください'
        }
        let password_error_msg = ''
        if (formState.password == FORM_STATE_DEFAULT_VALUE_FOR_GOOGLE.password) {
            password_error_msg = 'パスワードを入力してください'
        }
        setDhuPortalInputError({
            username: username_error_msg,
            password: password_error_msg,
        })
    }

    // class_eventsをgoogleに追加する
    const postToGoogleCalendar = async (class_events: RawClassEvent[]) => {
        if (!session) return
        let already_posted_event_list: Event[]
        try {
            already_posted_event_list = await getAlreadyPostedEvents(session)
            class_events = class_events.filter(
                (class_event) => !isEventDuplicated(already_posted_event_list, class_event),
            )
        } catch (e) {
            alert('Google Calendarに登録されている既存の予定の取得に失敗しました')
            return
        }
        setTotalImportCount(class_events.length)
        for (const class_event of class_events) {
            addEventToGoogleCal(class_event.start, class_event.title)
            await new Promise(function (resolve) {
                setTimeout(resolve, 300)
            })
        }
        if (class_events.length == 0) {
            alert(`すべての予定がGoogle Calendarに追加されていたので、インポートしませんでした`)
        } else alert(`${class_events.length}件のインポートに成功しました`)
    }

    async function getAlreadyPostedEvents(session: Session) {
        let res: CalendarList | GetEventsErrorObject
        let next_page_token = ''
        const already_posted_events: Array<Event> = []
        const { start, end } = getQuarterRange(
            parseInt(formState.importYear),
            formState.importRange,
        )
        do {
            let query_param: object
            if (next_page_token != '') query_param = { pageToken: next_page_token }
            else {
                query_param = {
                    maxResults: 2000,
                    timeMax: end.toISOString(),
                    timeMin: start.toISOString(),
                    orderBy: 'startTime',
                    singleEvents: true,
                }
            }
            const google_api_url = `https://www.googleapis.com/calendar/v3/calendars/${
                formState.toCalendar
            }/events?${encodeQueryData(query_param)}`
            const raw_response = await fetch(google_api_url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json',
                },
            })
            res = await raw_response.json()
            if (isGetEventErrorObject(res)) {
                console.error(res)
                throw Error(`status ${res.error.code}`)
            }
            if (res.nextPageToken) next_page_token = res.nextPageToken
            already_posted_events.push(...res.items)
        } while (res.nextPageToken !== undefined)
        return already_posted_events
    }

    async function addEventToGoogleCal(start: string, title: string) {
        if (!(session && session.user)) return
        const google_api_url = `https://www.googleapis.com/calendar/v3/calendars/${formState.toCalendar}/events`
        const res = await fetch(google_api_url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                end: { dateTime: getEndTime(start) },
                start: { dateTime: start },
                summary: title,
                description: '#created_by_dp2gc',
            }),
        })
        if (res.status >= 400) {
            res.json().then((data) => {
                console.log(data)
            })
            alert(
                `${start}から始まる${title}の追加に失敗しました。もう一度インポートするとうまくいく場合があります。`,
            )
        }
        setImportCount((prevCount) => prevCount + 1)
    }

    // If we sort Event, we can bisect the search by date.
    function isEventDuplicated(
        already_posted_event_list: Event[],
        class_event: RawClassEvent,
    ): boolean {
        for (const already_posted_event of already_posted_event_list) {
            if (!already_posted_event.start.dateTime) {
                continue
            }
            const is_class_title_same = class_event.title == already_posted_event.summary
            const is_start_time_same =
                new Date(class_event.start).toISOString() ==
                new Date(already_posted_event.start.dateTime).toISOString()
            if (is_class_title_same && is_start_time_same) {
                return true
            }
        }
        return false
    }

    return (
        <Stack spacing={2} component='form' action='/import'>
            <FormControl margin='normal'>
                <InputLabel id='import-year-label'>インポート年度</InputLabel>
                <Select
                    {...register('importYear', { required: true, valueAsNumber: true })}
                    disabled={appState != 'ready'}
                    value={formState.importYear}
                    onChange={handleSelectChange}
                    name='importYear'
                    labelId='import-year-label'
                    label='インポート先カレンダー'
                    margin='dense'
                >
                    {selectableYears.map((selectableYear: number, i: number) => (
                        <MenuItem value={selectableYear} key={i}>
                            {selectableYear}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <ImportRange
                register={register}
                disabled={appState != 'ready'}
                errorMessage={errors.importRange?.message}
                value={formState.importRange}
                onChange={handleSelectChange}
            />
            <ToCalendar
                register={register}
                disabled={appState != 'ready'}
                errorMessage={errors.toCalendar?.message}
                value={formState.toCalendar}
                onChange={handleSelectChange}
                setAccessToken={setAccessToken}
            />
            <Stack spacing={1}>
                <TextField
                    {...register('username', { required: true })}
                    disabled={appState != 'ready'}
                    error={'username' in errors}
                    onChange={handleInputChange}
                    value={formState.username}
                    name='username'
                    id='standard-basic'
                    label='デジキャン ユーザーネーム'
                    variant='standard'
                    helperText={errors.username?.message}
                />
                <TextField
                    {...register('password', { required: true })}
                    disabled={appState != 'ready'}
                    error={'password' in errors}
                    type='password'
                    onChange={handleInputChange}
                    value={formState.password}
                    required
                    name='password'
                    id='standard-basic'
                    label='デジキャン パスワード'
                    variant='standard'
                    helperText={errors.password?.message}
                />
            </Stack>
            <ImportOptions
                disabled={appState != 'ready'}
                value={formState.ignoreOtherEvents}
                onChange={handleInputChange}
            />
            <input type='hidden' name='accessToken' value={accessToken} />
            <br />
            <Button
                disabled={
                    appState == 'unauthenticated' ||
                    appState == 'connect portal' ||
                    appState == 'import'
                }
                variant='contained'
                type='submit'
                onClick={handleSubmit(onSubmit)}
            >
                {appState == 'connect portal' ? 'デジキャンから読み込んでいます...' : ''}
                {appState == 'import' ? `(${importCount}件/${totalImportCount}件)` : ''}
                {appState == 'unauthenticated'
                    ? 'Googleアカウントにログインしてください'
                    : 'インポート'}
            </Button>
            <AllDeleteButton disabled={appState == 'unauthenticated'} />
        </Stack>
    )
}
