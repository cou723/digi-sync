import {FormInputs} from '../types/formInputs'
import { RawClassEvent } from '../types/types'
import {
    getQuarterRange,
    getNowAcademicYear,
} from './utils'

export const INIT_REQUIRE_VALUE_LIST = ['importRange', 'toCalendar', 'username', 'password']

export const FORM_STATE_DEFAULT_VALUE: FormInputs = {
    importYear: getNowAcademicYear().toString(),
    importRange: '',
    username: '',
    password: '',
    ignoreOtherEvents: true,
} as FormInputs

export function excludeOutOfImportRange(
    formState: FormInputs,
    class_events: RawClassEvent[],
): RawClassEvent[] {
    const { start: start_date, end: end_date } = getQuarterRange(
        parseInt(formState.importYear),
        formState.importRange,
    )
    const start = start_date.getTime()
    const end = end_date.getTime()
    return class_events.filter((class_event) => {
        const start_date = new Date(class_event.start).getTime()
        return start_date > start && start_date < end
    })
}

export async function fetchClassEventList(
    formState: FormInputs,
    setAppState: (s: 'unauthenticated' | 'ready' | 'connect portal' | 'import') => void,
): Promise<RawClassEvent[]> {
    setAppState('connect portal')
    let res
    let event_list: RawClassEvent[]
    const query_param_obj = {
        importYear: formState.importYear,
        importRange: formState.importRange,
        username: formState.username,
        password: formState.password,
    }
    const query_param_str = new URLSearchParams(query_param_obj).toString()
    try {
        res = await fetch(process.env.NEXT_PUBLIC_API_DOMAIN + '/class_events?' + query_param_str, {
            method: 'GET',
        })
        event_list = await res.json()
        console.log('res', res)
    } catch {
        throw new Error('サーバーに接続できませんでした')
    }
    if (res.status_code == '401' && res.detail == 'user id or password is invalid')
        throw new Error('ユーザー名またはパスワードが違います')
    return event_list
}

export const getSelectableYearList = (): number[] => {
    return new Array<number>(
        new Date().getFullYear() - 1,
        new Date().getFullYear(),
        new Date().getFullYear() + 1,
    )
}
