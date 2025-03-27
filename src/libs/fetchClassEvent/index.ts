import { JSDOM } from "jsdom";
import { NextApiRequest } from "next";

import { parseClassEvents } from "@/pages/api/classEvents";
import ImportRange from "@/types/importRange";
import { SessionData } from "@/types/sessionData";
import { ClassEvent } from "@/types/types";
import { YearMonth } from "@/types/yearMonth";

import { API_URL, LOGIN_URL } from "../constants";

import { generateBody, generateHeaders, generateLoginBody } from "./generateParam";

const jsdom = new JSDOM();
const htmlParser = new jsdom.window.DOMParser();

// api
export async function fetchClassEvents(req: NextApiRequest) {
	const { username, password, importYear, importRange } = {
		...req.body,
		importRange: new ImportRange(req.body.importRange),
	};

	const importYearMonthList = importRange.getYearMonthList(new Date().getFullYear());

	console.log("username", username);
	console.log("password", "******");
	console.log("year", importYear);
	console.log("range", importRange);

	const sessionData = await fetchSessionData(username, password);

	const classEvents: ClassEvent[] = [];
	console.log("yearMonthList :", importYearMonthList);
	for (const yearMonth of importYearMonthList)
		classEvents.push(...(await fetchClassEventsPerOneMonth(yearMonth, sessionData)));
	return classEvents;
}

export async function fetchClassEventsPerOneMonth(
	targetMonth: YearMonth,
	sessionData: SessionData,
): Promise<ClassEvent[]> {
	console.log("get :", targetMonth);
	console.log("body :", generateBody(targetMonth.year, targetMonth.month, sessionData));
	const dhuPortalRes = await fetch(API_URL, {
		body: generateBody(targetMonth.year, targetMonth.month, sessionData),
		headers: generateHeaders(sessionData.j_session_id),
		method: "POST",
	});

	if (!dhuPortalRes.ok) throw Error("Failed to fetch class events from DHU Portal.");
	console.log(dhuPortalRes);

	let classEvents: ClassEvent[];
	try {
		classEvents = (await parseClassEvents(dhuPortalRes)).events;
	} catch (e) {
		console.log(e);
		throw Error("Failed to parse class events from DHU Portal. Maybe your login is failing.");
	}
	console.log(targetMonth, classEvents.length);
	return classEvents;
}
async function fetchSessionData(username: string, password: string): Promise<SessionData> {
	const res = await extractLoginResponse(username, password);
	if (res.status != 200) throw new Error("Login failed");

	const documentAfterLogin = htmlParser.parseFromString(await res.text(), "text/html");
	const inputListInLoginForm = Array.from(documentAfterLogin.querySelectorAll("input"));
	console.log(
		"inputListInLoginForm :",
		inputListInLoginForm.map((i) => i.name),
	);

	return {
		j_session_id: extractJSessionId(res.headers.get("set-cookie")),
		javax_faces_view_state: inputListInLoginForm.find((input) => input.name == "rx-token")!
			.value,
		rx_login_key: inputListInLoginForm.find((input) => input.name == "rx-loginKey")!.value,
		rx_token: inputListInLoginForm.find((input) => input.name == "javax.faces.ViewState")!
			.value,
	};
}

async function extractLoginResponse(username: string, password: string): Promise<Response> {
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
	const match = cookie.match(/JSESSIONID=([^;]+)/);
	return match ? match[1] : "";
}
