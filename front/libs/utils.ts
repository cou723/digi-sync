export function encodeQueryData(data: { [key: string]: any }) {
    const searchParams = new URLSearchParams()
    for (const key in data) {
        searchParams.set(key, data[key])
    }
    return searchParams.toString()
}

export function getEndTime(class_start_time: string): string {
    const end_date_unix_timestamp = Date.parse(class_start_time) + 60 * 90 * 1000
    const end_date: Date = new Date(end_date_unix_timestamp)
    end_date.setMinutes(end_date.getMinutes())
    return end_date.toISOString().slice(0, -5) + '+0000'
}

export type Range = { start: Date; end: Date }
export function getQuarterRanges(year: number) {
    return {
        _1q_start: new Date(year, 4 - 1, 1),
        _2q_start: new Date(year, 6 - 1, 10),
        _3q_start: new Date(year, 9 - 1, 1),
        _4q_start: new Date(year, 11 - 1, 25),

        _1q_end: new Date(year, 6 - 1, 9, 23, 59, 59),
        _2q_end: new Date(year, 8 - 1, 31, 23, 59, 59),
        _3q_end: new Date(year, 11 - 1, 24, 23, 59, 59),
        _4q_end: new Date(year + 1, 2 - 1, new Date(year, 2, 0).getDate(), 23, 59, 59),
    }
}

export function getQuarterRange(year: number, importRange: string): Range {
    const r = getQuarterRanges(year)
    if (importRange == '1q') return { start: r._1q_start, end: r._1q_end }
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
    return (
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
    const thisMonth = new Date().getMonth();
    if (thisMonth >= 1 && thisMonth <= 2) return new Date().getFullYear() - 1;
    return new Date().getFullYear();
}
