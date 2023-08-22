import dayjs, { Dayjs } from "dayjs";
import { Session } from "next-auth";
import { FormInputs } from "./formInputsTypes";
import { Events, Event } from "./gapiCalendar";
import ImportRange from "./importRange";
import { ClassEvent, RawClassEvent } from "./types";
import {
	encodeQueryData,
	getClassEndTime,
	GetEventsErrorObject,
	isGetEventErrorObject,
} from "libs/utils";
