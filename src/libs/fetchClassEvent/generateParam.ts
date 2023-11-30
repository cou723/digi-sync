import dayjs from "dayjs";

import { SessionData } from "@/types/sessionData";

export function generateLoginBody(username: string, password: string): string {
	const data = new URLSearchParams();
	data.append("loginForm", "loginForm");
	data.append("loginForm:userId", username);
	data.append("loginForm:password", password);
	data.append("loginForm:loginButton", "");
	data.append("javax.faces.ViewState", "stateless");
	return data.toString();
}

export function generateHeaders(jSessionId: string): Record<string, string> {
	return {
		Accept: "application/xml, text/xml, */*; q=0.01",
		"Accept-Encoding": "gzip, deflate, br",
		"Accept-Language": "ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7",
		"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		Cookie: generateCookie({
			jSessionId: jSessionId,
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

export function generateBody(year: number, month: number, sessionData: SessionData): string {
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

export function generateCookie(param: { jSessionId: string }): string {
	return `HttpOnly; JSESSIONID = ${param.jSessionId}; _ga = GA1.1.1861578561.1676779041; _ga_CNQG4KE1EB = GS1.1.1676779040.1.1.1676779053.47.0.0`;
}
