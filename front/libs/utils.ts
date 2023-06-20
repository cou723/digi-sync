import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export function encodeQueryData(data: { [key: string]: string | number | boolean }) {
    const searchParams = new URLSearchParams()
    for (const key in data) {
        let value
        if (typeof data[key] === 'number' || typeof data[key] === 'boolean')
            value = String(data[key])
        else value = data[key]
        searchParams.set(key, value)
    }
    return searchParams.toString()
}

export function getClassEndTime(class_start_string: string): string {
    const class_start_time = dayjs(class_start_string)
    class_start_time.add(90, 'minute')
    return class_start_time.add(90, 'minute').utc().format('YYYY-MM-DDTHH:mm:ssZZ')
}

export interface GetEventsErrorObject {
    error: {
        errors: [
            {
                domain: string
                reason: string
                message: string
            },
        ]
        code: number
        message: string
    }
}

export function isGetEventErrorObject(obj: object): obj is GetEventsErrorObject {
    if (!(typeof obj == 'object' && 'error' in obj)) return false
    return !!(
        typeof obj.error == 'object' &&
        obj.error &&
        'errors' in obj.error &&
        'code' in obj.error &&
        'message' in obj.error &&
        Array.isArray(obj.error.errors) &&
        obj.error.errors &&
        obj.error.errors[0] &&
        'domain' in obj.error.errors[0] &&
        'reason' in obj.error.errors[0] &&
        'message' in obj.error.errors[0]
    )
}

export function getNowAcademicYear(): number {
    const thisMonth = dayjs().month()
    if (thisMonth >= 1 && thisMonth <= 2) return dayjs().year() - 1
    return dayjs().year()
}
