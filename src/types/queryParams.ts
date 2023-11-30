import { isImportRangeString } from "./importRangeString";

export type QueryParams = {
	importRange: string;
	importYear: string;
	password: string;
	username: string;
};

export function isQueryParams(obj: unknown): obj is QueryParams {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"importRange" in obj &&
		"importYear" in obj &&
		"password" in obj &&
		"username" in obj &&
		isImportRangeString(obj.importRange) &&
		typeof obj.importYear === "string" &&
		typeof obj.password === "string" &&
		typeof obj.username === "string"
	);
}
