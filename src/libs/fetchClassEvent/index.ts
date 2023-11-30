import { JSDOM } from "jsdom";
import { NextApiRequest } from "next";

import { parseClassEvents } from "@/pages/api/classEvents";
import ImportRange from "@/types/importRange";
import { QueryParams } from "@/types/queryParams";
import { SessionData } from "@/types/sessionData";
import { ClassEvent } from "@/types/types";
import { YearMonth } from "@/types/yearMonth";

import { API_URL, LOGIN_URL } from "../constants";

import { generateBody, generateHeaders, generateLoginBody } from "./generateParam";

const jsdom = new JSDOM();
const htmlParser = new jsdom.window.DOMParser();

// api
export async function fetchClassEvents(req: NextApiRequest) {
	const { username, password, importYear, importRange } = parseBody(req.body);

	const importYearMonthList = importRange.getYearMonthList(new Date().getFullYear());

	console.log("username", username);
	console.log("password", "******");
	console.log("year", importYear);
	console.log("range", importRange);

	const sessionData = await getSessionData(username, password);

	const classEvents: ClassEvent[] = [];
	console.log("yearMonthList :", importYearMonthList);
	for (const yearMonth of importYearMonthList)
		classEvents.push(...(await fetchClassEventsPerOneMonth(yearMonth, sessionData)));
	return classEvents;
}

export function parseBody(body: QueryParams) {
	return {
		importRange: new ImportRange(body.importRange),
		importYear: body.importYear,
		password: body.password,
		username: body.username,
	};
}

export async function fetchClassEventsPerOneMonth(
	yearMonth: YearMonth,
	sessionData: SessionData,
): Promise<ClassEvent[]> {
	console.log("get :", yearMonth);
	const dhuPortalRes = await fetch(API_URL, {
		body: generateBody(yearMonth.year, yearMonth.month, sessionData),
		headers: generateHeaders(sessionData.j_session_id),
		method: "POST",
	});

	if (!dhuPortalRes.ok) throw Error("Failed to fetch class events from DHU Portal.");

	let classEvents: ClassEvent[];
	try {
		classEvents = (await parseClassEvents(dhuPortalRes)).events;
	} catch (e) {
		console.log(e);
		throw Error("Failed to parse class events from DHU Portal. Maybe your login is failing.");
	}
	console.log(yearMonth, classEvents.length);
	return classEvents;
}
async function getSessionData(username: string, password: string): Promise<SessionData> {
	const res = await getLoginResponse(username, password);
	if (res.status != 200) throw new Error("Login failed");
	const documentAfterLogin = htmlParser.parseFromString(await res.text(), "text/html");

	const sessionData: SessionData = {
		j_session_id: extractJSessionId(res.headers.get("set-cookie")),
		javax_faces_view_state: "",
		rx_login_key: "",
		rx_token: "",
	};
	for (const input of documentAfterLogin.querySelectorAll("input")) {
		if (input.name == "rx-token") sessionData.rx_token = input.value;
		if (input.name == "rx-loginKey") sessionData.rx_login_key = input.value;
		if (input.name == "javax.faces.ViewState") sessionData.javax_faces_view_state = input.value;
	}

	return sessionData;
}

async function getLoginResponse(username: string, password: string): Promise<Response> {
	const res = await fetch(LOGIN_URL, {
		body: generateLoginBody(username, password),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		method: "POST",
	});
	return res;
}

function extractJSessionId(cookie: string | null): string {
	if (cookie === null) return "";
	const regex = /JSESSIONID=([^;]+)/;
	const match = cookie.match(regex);
	if (match) {
		const jsessionid = match[1];
		return jsessionid;
	}
	return "";
}
