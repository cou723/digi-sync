export type FormInputs = {
	[key: string]: string | boolean;
	ignoreOtherEvents: boolean;
	importRange: string;
	importYear: string;
	password: string;
	username: string;
};

export type GoogleFormInputs = {
	toCalendar: string;
} & FormInputs;
