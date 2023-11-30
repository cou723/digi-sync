export type AddClassStartTimeArgsType = {
	lessonTimes: { hour: number; minute: number }[];
	periodIndex: number;
};
export type AddClassStartTimeReturnType = number;

const addClassStartTime = ({
	lessonTimes,
	periodIndex,
}: AddClassStartTimeArgsType): AddClassStartTimeReturnType => {
	if (lessonTimes.length !== 6) throw new Error("lessonTimes.length must be 6");
	const timeList = [
		lessonTimes[0].hour * 60 + lessonTimes[0].minute,
		lessonTimes[1].hour * 60 + lessonTimes[1].minute,
		lessonTimes[2].hour * 60 + lessonTimes[2].minute,
		lessonTimes[3].hour * 60 + lessonTimes[3].minute,
		lessonTimes[4].hour * 60 + lessonTimes[4].minute,
		lessonTimes[5].hour * 60 + lessonTimes[5].minute,
	];
	return timeList[periodIndex];
};

export default addClassStartTime;
