import dayjs, {type Dayjs} from 'dayjs';

type ClassType = 'eventJugyo' | 'eventDuring';

class ClassEvent {
	id: string;
	title: string;
	start: Dayjs;
	end: Dayjs;
	allDay: boolean;
	editable: boolean;
	className: ClassType[];

	constructor(text: string) {
		const object = JSON.parse(text);
		this.id = object.id;
		this.title = object.title;
		this.start = dayjs(object.start);
		this.end = dayjs(object.end);
		this.allDay = object.allDay;
		this.editable = object.editable;
		const classNameList = object.className.split(' ');
		this.className = classNameList.map(className => className as ClassType);
	}
}
