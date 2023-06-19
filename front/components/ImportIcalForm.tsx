import { yupResolver } from '@hookform/resolvers/yup'
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
} from '@mui/material'
import { RhfTextField } from './ImportModules/RhfTextField'
import React, { ChangeEvent,  useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import {
    excludeOutOfImportRange,
    fetchClassEventList,
    FORM_STATE_DEFAULT_VALUE,
    getSelectableYearList,
} from '../libs/importFormCommons'
import { ConvertToIcalMap } from '../libs/table-to-ical/ConvertToIcal'
import { DownloadBrowser } from '../libs/table-to-ical/DownloadBrowser'
import { FormInputs } from '../types/formInputs'
import { RawClassEvent } from '../types/types'
import ImportOptions from './ImportModules/ImportOptions'
import ImportRange from './ImportModules/ImportRange'

export interface API_RETURN_EventList {
    events: RawClassEvent[]
}

const schema = yup.object().shape({
    importYear: yup.number(),
    importRange: yup.string().required('インポートする範囲を選択してください'),
    username: yup.string().required('入力してください'),
    password: yup.string().required('入力してください'),
    ignoreOtherEvents: yup.boolean(),
})


export function ImportIcalForm() {
    const [formState, setFormState] = useState<FormInputs>(FORM_STATE_DEFAULT_VALUE)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInputs>({
        resolver: yupResolver(schema),
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

    const onSubmit = async (inputs: FormInputs) => {
        let class_event_list: RawClassEvent[]
        try {
            class_event_list = await fetchClassEventList(inputs, setAppState)
            console.log('data ', class_event_list)
        } catch (e: any) {
            alert(e.message)
            console.log(e)
            setAppState('ready')
            return
        }
        if(class_event_list)
        setAppState('import')
        if (inputs.ignoreOtherEvents) {
            class_event_list = class_event_list.filter(
                (e: RawClassEvent) => e.className.indexOf('eventJugyo') !== -1,
            )
        }
        class_event_list = excludeOutOfImportRange(inputs, class_event_list)
        const IcalTimeTable: any = ConvertToIcalMap(class_event_list)
        if (IcalTimeTable != null) DownloadBrowser(IcalTimeTable)
        setAppState('ready')
    }

    return (
        <Stack spacing={2} component='form' autoComplete='off' action='/import'>
            <FormControl margin='normal'>
                <InputLabel id='import-year-label'>インポート年度</InputLabel>
                <Select
                    {...register('importYear', { required: true, valueAsNumber: true })}
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
                errorMessage={errors.importRange?.message}
                value={formState.importRange}
                onChange={handleSelectChange}
            />
            <Stack spacing={1}>
            <RhfTextField
                    name = 'username'
                    register = {register}
                    error_message = {errors.username?.message}
                    onChange = {handleInputChange}
                    value = {formState.username}
                    label = 'デジキャン ユーザーネーム'
                />
                <RhfTextField
                    name = 'password'
                    type = 'password'
                    register = {register}
                    error_message = {errors.username?.message}
                    onChange = {handleInputChange}
                    value = {formState.password}
                    label = 'デジキャン パスワード'
                />
            </Stack>
            <ImportOptions
                value={formState.ignoreOtherEvents}
                onChange={handleInputChange}
            />
            <br />
            <Button
                disabled={appState == 'connect portal'}
                variant='contained'
                onClick={handleSubmit(onSubmit)}
            >
                {appState == 'connect portal' ? 'デジキャンから読み込んでいます...' : 'インポート'}
            </Button>
        </Stack>
    )
}
