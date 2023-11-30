import { XMLParser } from "fast-xml-parser";

import ImportRange from "../../types/importRange";
import { ClassEvent, RawClassEvent } from "../../types/types";

import type { NextApiRequest, NextApiResponse } from "next";

import "dayjs/locale/ja";
import { fetchClassEvents, isQueryParams } from "@/libs/fetchClassEvent";

const xml_parser = new XMLParser();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method != "POST") return res.status(405).json({ error: "Method Not Allowed" });
	if (req.body == null) return res.status(400).json({ error: "Empty Body" });
	if (req.headers["content-type"] != "application/json")
		return res.status(400).json({ error: "Invalid Content-Type" });
	if (!isQueryParams(req.body)) return res.status(400).json({ error: "Invalid Body" });

	fetchClassEvents(req);

	const class_events: ClassEvent[] = [];
	try {
		class_events.push(...(await fetchClassEvents(req)));
	} catch (e: unknown) {
		console.log(e);
		if (e instanceof Error) return res.status(500).json({ error: e.message });
		else return res.status(500).json({ error: "Unknown error" });
	}

	return res.status(200).json(class_events);
}

export function isImportRangeString(obj: unknown): obj is ImportRange {
	return (
		obj === "1q" ||
		obj === "2q" ||
		obj === "3q" ||
		obj === "4q" ||
		obj === "1q_and_2q" ||
		obj === "3q_and_4q"
	);
}

export async function parseClassEvents(res: Response): Promise<{ events: ClassEvent[] }> {
	const xml_response_body = xml_parser.parse(await res.text());

	const json_class_events = xml_response_body["partial-response"]["changes"]["update"].filter(
		(x: string) => x.includes("events"),
	)[0];

	let non_typed_class_events: RawClassEvent[];
	try {
		non_typed_class_events = JSON.parse(json_class_events).events;
	} catch (e) {
		console.log(json_class_events);
		throw new Error("Failed to parse json_class_events");
	}

	const class_events: ClassEvent[] = [];
	for (const event of non_typed_class_events) class_events.push(new ClassEvent(event));
	return { events: class_events };
}
