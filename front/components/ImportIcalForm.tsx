import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
} from '@mui/material'
import React, { ChangeEvent, ReactNode, useEffect, useState } from 'react'
import {
    excludeOutOfImportRange,
    fetchClassEventList,
    INIT_REQUIRE_VALUE_LIST,
    FORM_STATE_DEFAULT_VALUE,
    getSelectableYearList,
} from '../libs/importFormCommons'
import { ConvertToIcalMap } from '../libs/table-to-ical/ConvertToIcal'
import { DownloadBrowser } from '../libs/table-to-ical/DownloadBrowser'
import { FormInputs } from '../types/formInputs'
import { RawClassEvent } from '../types/types'
import DHUPortalData from './ImportModules/DHUPortalData'
import ImportOptions from './ImportModules/ImportOptions'
import ImportRange from './ImportModules/ImportRange'

export interface API_RETURN_EventList {
    events: RawClassEvent[]
}

export function ImportIcalForm() {
    const [formState, setFormState] = useState<FormInputs>(FORM_STATE_DEFAULT_VALUE)

    const [importRangeError, setImportRangeError] = useState<string>('')
    const [dhuPortalInputError, setDhuPortalInputError] = useState({
        username: '',
        password: '',
    })

    const [appState, setAppState] = useState<
        'unauthenticated' | 'ready' | 'connect portal' | 'import'
    >('unauthenticated')

    const selectableYears: Array<number> = getSelectableYearList()

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
        setFormState({
            ...formState,
            [event.target.name]: value,
        })
    }

    const onImportClick = async () => {
        resetErrorMessage()

        if (existsStateEmpty()) {
            setErrorMessages()
            return
        }

        let class_event_list: RawClassEvent[]
        try {
            class_event_list = await fetchClassEventList(formState, setAppState)
            console.log('data ', class_event_list)
        } catch (e: any) {
            alert(e.message)
            console.log(e)
            setAppState('ready')
            return
        }
        setAppState('import')
        if (formState.ignoreOtherEvents) {
            class_event_list = class_event_list.filter(
                (e: RawClassEvent) => e.className.indexOf('eventJugyo') !== -1,
            )
        }
        class_event_list = excludeOutOfImportRange(formState, class_event_list)
        const IcalTimeTable: any = ConvertToIcalMap(class_event_list)
        if (IcalTimeTable != null) DownloadBrowser(IcalTimeTable)
        setAppState('ready')
    }

    function existsStateEmpty() {
        for (const input_label of Object.keys(formState)) {
            if (
                INIT_REQUIRE_VALUE_LIST.includes(input_label) &&
                FORM_STATE_DEFAULT_VALUE[input_label] == formState[input_label]
            )
                return true
        }
        return false
    }

    function resetErrorMessage() {
        setImportRangeError(FORM_STATE_DEFAULT_VALUE.importRange)
        setDhuPortalInputError({
            username: FORM_STATE_DEFAULT_VALUE.username,
            password: FORM_STATE_DEFAULT_VALUE.password,
        })
    }

    function setErrorMessages() {
        if (formState.importRange == FORM_STATE_DEFAULT_VALUE.importRange) {
            setImportRangeError('インポート範囲が指定されていません')
        }
        let username_error_msg = ''
        if (formState.username == FORM_STATE_DEFAULT_VALUE.username) {
            username_error_msg = 'ユーザー名を入力してください'
        }
        let password_error_msg = ''
        if (formState.password == FORM_STATE_DEFAULT_VALUE.password) {
            password_error_msg = 'パスワードを入力してください'
        }
        setDhuPortalInputError({
            username: username_error_msg,
            password: password_error_msg,
        })
    }

    return (
        <Stack spacing={2} component='form' autoComplete='off' action='/import'>
            <FormControl margin='normal'>
                <InputLabel id='import-year-label'>インポート年度</InputLabel>
                <Select
                    value={formState.importYear}
                    onChange={handleSelectChange}
                    name='importYear'
                    labelId='import-year-label'
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
                disabled={false}
                errorMessage={importRangeError}
                value={formState.importRange}
                onChange={handleSelectChange}
            />
            <DHUPortalData
                disabled={false}
                error={dhuPortalInputError}
                username={formState.username}
                password={formState.password}
                onChange={handleInputChange}
            />
            <ImportOptions
                disabled={false}
                value={formState.ignoreOtherEvents}
                onChange={handleInputChange}
            />
            <br />
            <Button
                disabled={appState == 'connect portal' || appState == 'import'}
                variant='contained'
                onClick={onImportClick}
            >
                {appState == 'connect portal' ? 'デジキャンから読み込んでいます...' : 'インポート'}
            </Button>
        </Stack>
    )
}
