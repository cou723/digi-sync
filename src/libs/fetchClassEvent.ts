import dayjs from "dayjs";
import { JSDOM } from "jsdom";
import { NextApiRequest } from "next";

import { isImportRangeString, parseClassEvents } from "@/pages/api/classEvents";
import ImportRange from "@/types/importRange";
import { ClassEvent } from "@/types/types";
import { YearMonth } from "@/types/yearMonth";

import { API_URL, LOGIN_URL } from "./constants";

const jsdom = new JSDOM();
const html_parser = new jsdom.window.DOMParser();

type SessionData = {
	j_session_id: string;
	javax_faces_view_state: string;
	rx_login_key: string;
	rx_token: string;
};

type QueryParams = {
	importRange: string;
	importYear: string;
	password: string;
	username: string;
};

export async function fetchClassEvents(req: NextApiRequest) {
	const { username, password, importYear, importRange } = parseBody(req.body);

	const importYearMonthList = importRange.getYearMonthList(new Date().getFullYear());

	console.log("username", username);
	console.log("password", "******");
	console.log("year", importYear);
	console.log("range", importRange);

	const sessionData = await getSessionData(username, password);

	const class_events: ClassEvent[] = [];
	for (const yearMonth of importYearMonthList)
		class_events.push(...(await fetchClassEventsPerOneMonth(yearMonth, sessionData)));
	return class_events;
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
	session_data: SessionData,
): Promise<ClassEvent[]> {
	console.log("get :", yearMonth);
	const dhuPortalRes = await fetch(API_URL, {
		body: generateBody(yearMonth.year, yearMonth.month, session_data),
		headers: generateHeaders(session_data.j_session_id),
		method: "POST",
	});

	if (!dhuPortalRes.ok) throw Error("Failed to fetch class events from DHU Portal.");

	let class_events: ClassEvent[];
	try {
		class_events = (await parseClassEvents(dhuPortalRes)).events;
	} catch (e) {
		console.log(e);
		throw Error("Failed to parse class events from DHU Portal. Maybe your login is failing.");
	}
	console.log(yearMonth, class_events.length);
	return class_events;
}
async function getSessionData(username: string, password: string): Promise<SessionData> {
	const res = await getLoginResponse(username, password);
	if (res.status != 200) throw new Error("Login failed");
	const document_after_login = html_parser.parseFromString(await res.text(), "text/html");

	const session_data: SessionData = {
		j_session_id: extractJSessionId(res.headers.get("set-cookie")),
		javax_faces_view_state: "",
		rx_login_key: "",
		rx_token: "",
	};
	for (const input of document_after_login.querySelectorAll("input")) {
		if (input.name == "rx-token") session_data.rx_token = input.value;
		if (input.name == "rx-loginKey") session_data.rx_login_key = input.value;
		if (input.name == "javax.faces.ViewState")
			session_data.javax_faces_view_state = input.value;
	}

	return session_data;
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

function generateLoginBody(username: string, password: string): string {
	const data = new URLSearchParams();
	data.append("loginForm", "loginForm");
	data.append("loginForm:userId", username);
	data.append("loginForm:password", password);
	data.append("loginForm:loginButton", "");
	data.append("javax.faces.ViewState", "stateless");
	return data.toString();
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

export function generateHeaders(j_session_id: string): Record<string, string> {
	return {
		Accept: "application/xml, text/xml, */*; q=0.01",
		"Accept-Encoding": "gzip, deflate, br",
		"Accept-Language": "ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7",
		"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		Cookie: generateCookie({
			j_session_id,
		}),
		"Faces-Request": "partial/ajax",
		Origin: "https://portal.dhw.ac.jp",
		Referer: "https://portal.dhw.ac.jp/uprx/up/pk/pky001/Pky00101.xhtml",
		"Sec-Ch-Ua": 'Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114',
		"Sec-Ch-Ua-Mobile": "0",
		"Sec-Ch-Ua-Platform": "Windows",
		"Sec-Fetch-Dest": "empty",
		"Sec-Fetch-Mode": "cors",
		"Sec-Fetch-Site": "same-origin",
		"User-Agent":
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
		"X-Requested-With": "XMLHttpRequest",
	};
}

function generateBody(year: number, month: number, sessionData: SessionData): string {
	const data = new URLSearchParams();
	data.append("javax.faces.partial.ajax", "true");
	data.append("javax.faces.source", "funcForm:j_idt361:content");
	data.append("javax.faces.partial.execute", "funcForm:j_idt361:content");
	data.append("javax.faces.partial.render", "funcForm:j_idt361:content");
	data.append("funcForm:j_idt361:content", "funcForm:j_idt361:content");
	data.append(
		"funcForm:j_idt361:content_start",
		(dayjs(`${year}-${month}-1`).unix() * 1000).toString(),
	);
	data.append(
		"funcForm:j_idt361:content_end",
		(dayjs(`${year}-${month}-1`).add(1, "month").add(-1, "day").unix() * 1000).toString(),
	);
	data.append("funcForm", "funcForm");
	data.append("rx-token", sessionData.rx_token);
	data.append("rx-loginKey", sessionData.rx_login_key);
	data.append("rx-deviceKbn", "1");
	data.append("rx-loginType", "Gakuen");
	data.append("funcForm:j_idt162_activeIndex", "0");
	data.append("funcForm:j_idt361:j_idt1767:j_idt1767_input", dayjs().format("YYYY/MM/DD"));
	data.append("funcForm:j_idt361:content_view", "month");
	data.append("funcForm:j_idt361:j_idt2402:0:jugyoMemo", "");
	data.append("funcForm:j_idt361:j_idt2402:1:jugyoMemo", "");
	data.append("funcForm:j_idt361:j_idt2402:2:jugyoMemo", "");
	data.append("funcForm:j_idt361:j_idt2402:3:jugyoMemo", "");
	data.append("funcForm:j_idt361:j_idt2402:4:jugyoMemo", "");
	data.append("funcForm:j_idt361:j_idt2402:5:jugyoMemo", "");
	data.append("funcForm:j_idt361:j_idt2402:6:jugyoMemo", "");
	data.append("funcForm:j_idt361:j_idt2402:7:jugyoMemo", "");
	data.append("funcForm:j_idt361:j_idt2402:8:jugyoMemo", "");
	data.append("funcForm:j_idt361_activeIndex", "1");
	data.append("javax.faces.ViewState", sessionData.javax_faces_view_state);
	return data.toString();
}

function generateCookie(param: { j_session_id: string }): string {
	return `HttpOnly; JSESSIONID = ${param.j_session_id}; _ga = GA1.1.1861578561.1676779041; _ga_CNQG4KE1EB = GS1.1.1676779040.1.1.1676779053.47.0.0`;
}

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
