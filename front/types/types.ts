import dayjs, { Dayjs } from "dayjs";
import { isRawClassEvent } from "libs/utils";

type ClassType = "eventJugyo" | "eventDuring";

export type RawClassEvent = {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    editable: boolean;
    className: string | string[];
};

export class ClassEvent {
    id: string;
    title: string;
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
    allDay: boolean;
    editable: boolean;
    className: ClassType[];

    constructor(class_event: RawClassEvent) {
        if (!isRawClassEvent(class_event)) {console.log(class_event);throw new Error("Invalid class_event");}
        this.id = class_event.id;
        this.title = class_event.title;
        this.start = dayjs(class_event.start);
        this.end = dayjs(class_event.end);
        this.allDay = class_event.allDay;
        this.editable = class_event.editable;
        let classNameList;
        if (typeof class_event.className == "string") classNameList = classNameList= class_event.className.split(" ");
        else classNameList = class_event.className;
        this.className = classNameList.map((className) => className as ClassType);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}

export type Range = { start: Dayjs; end: Dayjs };
