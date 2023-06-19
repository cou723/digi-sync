import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export function encodeQueryData(data: { [key: string]: string | number | boolean}) {
    const searchParams = new URLSearchParams()
    for (const key in data) {
        let value
        if (typeof data[key] === 'number' || typeof data[key] === 'boolean') value = String(data[key])
        else value = data[key]
        searchParams.set(key, value)
    }
    return searchParams.toString()
}

export function getClassEndTimeString(class_start_string: string): string {
    const class_start_time = dayjs(class_start_string)
    class_start_time.add(90, 'minute')
    return class_start_time.add(90, 'minute').utc().format('YYYY-MM-DDTHH:mm:ssZZ')
}

export type Range = { start: Dayjs; end: Dayjs }
export function getQuarterRanges(year: number): { [key: string]: Dayjs } {
    return {
        _1q_start: dayjs(`${year}-4-1`),
        _2q_start: dayjs(`${year}-6-10`),
        _3q_start: dayjs(`${year}-9-1`),
        _4q_start: dayjs(`${year}-11-25`),

        _1q_end: dayjs(`${year}-6-9T23:59:59`),
        _2q_end: dayjs(`${year}-8-31T23:59:59`),
        _3q_end: dayjs(`${year}-11-24T23:59:59`),
        _4q_end: dayjs(`${year + 1}-3-31T23:59:59`),
    }
}

export function getQuarterRange(year: number, importRange: string): Range {
    const r = getQuarterRanges(year)
    if (importRange == '1q') return { start: r._1q_start, end: r.d_1q_end }
    else if (importRange == '2q') return { start: r._2q_start, end: r._2q_end }
    else if (importRange == '3q') return { start: r._3q_start, end: r._3q_end }
    else if (importRange == '4q') return { start: r._4q_start, end: r._4q_end }
    else if (importRange == '1q_and_2q') return { start: r._1q_start, end: r._2q_end }
    return { start: r._3q_start, end: r._4q_end }
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
