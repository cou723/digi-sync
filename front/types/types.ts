
export type Inputs = {
    importYear: string;
    importRange: string;
    toCalendar: string;
    username: string;
    password: string;
    ignoreOtherEvents: boolean;
    [key: string]: string | boolean;
};

export type ClassEvent = {
    allDay: boolean;
    className: string;
    editable: boolean;
    end: string;
    id: string;
    start: string;
    title: string;
};