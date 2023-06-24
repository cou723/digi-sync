export type FormInputs = {
    importYear: string;
    importRange: string;
    username: string;
    password: string;
    ignoreOtherEvents: boolean;
    [key: string]: string | boolean;
};

export type GoogleFormInputs = {
    toCalendar: string;
} & FormInputs;
