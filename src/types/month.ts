export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export function isMonth(n: number): n is Month {
	return n >= 1 && n <= 12;
}
