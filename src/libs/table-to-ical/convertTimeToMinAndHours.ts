export type ConvertTimeToMinAndHoursReturnType = {
	hour: number;
	minute: number;
};

/*
 * time に 12:34 って渡すと hour : 12 min : 34 って返す
 * */
const convertTimeToMinAndHours = ({
	time,
}: {
	time: string;
}): ConvertTimeToMinAndHoursReturnType => {
	const splitted = time.split(":");
	return { hour: parseInt(splitted[0]), minute: parseInt(splitted[1]) };
};

export default convertTimeToMinAndHours;
