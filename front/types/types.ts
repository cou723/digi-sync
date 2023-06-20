import dayjs, { Dayjs } from "dayjs";

type ClassType = "eventJugyo" | "eventDuring";

export type RawClassEvent = {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: string;
    editable: string;
    className: string;
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
        this.id = class_event.id;
        this.title = class_event.title;
        this.start = dayjs(class_event.start);
        this.end = dayjs(class_event.end);
        this.allDay = class_event.allDay == "true" ? true : false;
        this.editable = class_event.editable == "true" ? true : false;
        const classNameList = class_event.className.split(" ");
        this.className = classNameList.map((className) => className as ClassType);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}

export type Range = { start: Dayjs; end: Dayjs };
