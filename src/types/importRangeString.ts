export type ImportRangeString = "1q" | "2q" | "3q" | "4q" | "1q_and_2q" | "3q_and_4q";

export function isImportRangeString(value: string): value is ImportRangeString {
	return (
		value === "1q" ||
		value === "2q" ||
		value === "3q" ||
		value === "4q" ||
		value === "1q_and_2q" ||
		value === "3q_and_4q"
	);
}
