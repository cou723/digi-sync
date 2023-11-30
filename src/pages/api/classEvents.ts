import { XMLParser } from "fast-xml-parser";

import { fetchClassEvents } from "@/libs/fetchClassEvent";
import { isQueryParams } from "@/types/queryParams";

import { ClassEvent, RawClassEvent } from "../../types/types";

import type { NextApiRequest, NextApiResponse } from "next";

import "dayjs/locale/ja";

const xmlParser = new XMLParser();

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

export async function parseClassEvents(res: Response): Promise<{ events: ClassEvent[] }> {
	const xmlResponseBody = xmlParser.parse(await res.text());

	const jsonClassEvents = xmlResponseBody["partial-response"]["changes"]["update"].filter(
		(x: string) => x.includes("events"),
	)[0];

	let rawClassEvents: RawClassEvent[];
	try {
		rawClassEvents = JSON.parse(jsonClassEvents).events;
	} catch (e) {
		console.log(jsonClassEvents);
		throw new Error("Failed to parse json_class_events");
	}

	const classEvents: ClassEvent[] = rawClassEvents.map(
		(raw_class_event) => new ClassEvent(raw_class_event),
	);
	return { events: classEvents };
}
