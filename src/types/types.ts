import dayjs, { Dayjs } from "dayjs";

import { isRawClassEvent } from "@/libs/utils";

type ClassType = "eventJugyo" | "eventDuring";

export type RawClassEvent = {
	allDay: boolean;
	className: string | string[];
	editable: boolean;
	end: string;
	id: string;
	start: string;
	title: string;
};

export class ClassEvent {
	id: string;
	title: string;
	start: dayjs.Dayjs;
	end: dayjs.Dayjs;
	allDay: boolean;
	editable: boolean;
	className: ClassType[];

	constructor(classEvent: RawClassEvent) {
		if (!isRawClassEvent(classEvent)) {
			console.log(classEvent);
			throw new Error("Invalid class_event");
		}
		this.id = classEvent.id;
		this.title = classEvent.title;
		this.start = dayjs(classEvent.start);
		this.end = dayjs(classEvent.end);
		this.allDay = classEvent.allDay;
		this.editable = classEvent.editable;
		let classNameList;
		if (typeof classEvent.className == "string")
			classNameList = classNameList = classEvent.className.split(" ");
		else classNameList = classEvent.className;
		this.className = classNameList.map((className) => className as ClassType);
	}

	toString(): string {
		return JSON.stringify(this);
	}
}

export type Range = { end: Dayjs; start: Dayjs };
