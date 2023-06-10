import {get} from 'node:http';
import {Injectable} from '@nestjs/common';
import puppeteer from 'puppeteer';
import {type Dayjs} from 'dayjs';

type SessionData = {
	j_session_id: string;
	rx_login_key: string;
	rx_token: string;
	javax_faces_view_state: string;
};

const LOGIN_URL = 'https://portal.dhw.ac.jp/uprx/up/pk/pky001/Pky00101.xhtml';
const API_URL = 'https://portal.dhw.ac.jp/uprx/up/bs/bsa001/Bsa00101.xhtml';

async function getLoggedResponse(username: string, password: string): Promise<Response> {
	const res = await fetch('https://portal.dhw.ac.jp/uprx/up/pk/pky001/Pky00101.xhtml', {
		method: 'POST',
		body: JSON.stringify({
			loginForm: 'loginForm',
			'loginForm:userId': username,
			'loginForm:password': password,
			'javax.faces.ViewState': 'stateless',
		}),
	});
	if ((res.status / 100) >= 4) {
		return;
	}

	return res;
}

function getCookie(res: Response): string[] {
	const cookie_header = res.headers.get('Set-Cookie');
	if (!cookie_header) {
		return;
	}

	return cookie_header.split(';').map(cookie => cookie.trim());
}

function extractJSessionId(cookies: string[]): string {
	const regex = /JSESSIONID=([^;, ]+)/;
	const j_session_id_pair = regex.exec(cookies.find(cookie => cookie.includes('JSESSIONID')));
	return j_session_id_pair[0].split('=')[1];
}

async function getSessionData(username: string, password: string): Promise<SessionData> {
	const res = await getLoggedResponse(username, password);
	const cookies = getCookie(res);
	const j_session_id = extractJSessionId(cookies);
	return {j_session_id: j_session_id[0].split('=')[1], rx_login_key: 'test', rx_token: 'test', javax_faces_view_state: 'test'};
}

// Function get_form_data(res, year, month) {
// 	return {'javax.faces.partial.ajax': 'true', 'javax.faces.source': 'funcForm:j_idt361:content', 'javax.faces.partial.execute': 'funcForm:j_idt361:content', 'javax.faces.partial.render': 'funcForm:j_idt361:content', 'funcForm:j_idt361:content': 'funcForm:j_idt361:content', 'funcForm:j_idt361:content_start': Number.parseInt((time.mktime(date(year, month, 1).timetuple()) * 1000)), 'funcForm:j_idt361:content_end': Number.parseInt((time.mktime(date(year, month, get_last_day[month]).timetuple()) * 1000)), funcForm: 'funcForm', 'rx-token': get_input_value(res, 'rx-token'), 'rx-loginKey': get_input_value(res, 'rx-loginKey'), 'rx-deviceKbn': '1', 'rx-loginType': 'Gakuen', 'funcForm:j_idt162_activeIndex': '0', 'funcForm:j_idt361:j_idt1767:j_idt1767_input': '2022/12/16', 'funcForm:j_idt361:content_view': 'month', 'funcForm:j_idt361:j_idt2402:0:jugyoMemo': '', 'funcForm:j_idt361:j_idt2402:1:jugyoMemo': '', 'funcForm:j_idt361:j_idt2402:2:jugyoMemo': '', 'funcForm:j_idt361:j_idt2402:3:jugyoMemo': '', 'funcForm:j_idt361:j_idt2402:4:jugyoMemo': '', 'funcForm:j_idt361:j_idt2402:5:jugyoMemo': '', 'funcForm:j_idt361:j_idt2402:6:jugyoMemo': '', 'funcForm:j_idt361:j_idt2402:7:jugyoMemo': '', 'funcForm:j_idt361_activeIndex': '1', 'javax.faces.ViewState': get_input_value(res, 'javax.faces.ViewState')};
// }

// Async function get_dhu_event_list(username, password, year, month) {
//     var events_element, res;

//     if (year > Number.parseInt(date.today().year + 1) || year < Number.parseInt(date.today().year - 1)) {
//       throw new Error(`year(${year}) is out of range. year must be between this year and next year.`);
//     }

//     if (month < 1 || month > 12) {
//       throw new Error("month is out of range");
//     }

//     const page = loginDhuPortal(await puppeteer.launch(), username, password);
//     res = page.post("https://portal.dhw.ac.jp/uprx/up/bs/bsa001/Bsa00101.xhtml", {
//       "data": get_form_data(res, year, month)
//     });
//     res.raise_for_status();
//     events_element = null;

//     for (var updates_element, _pj_c = 0, _pj_a = ET.fromstring(res.text)[0], _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
//       updates_element = _pj_a[_pj_c];

//       if (updates_element.attrib["id"] === "funcForm:j_idt361:content") {
//         events_element = updates_element;
//         break;
//       }
//     }

//     if (events_element === null) {
//       throw new Error("funcForm:j_idt361:content is not found. maybe xml returned by dhu portal is changed.");
//     }

//     return json.loads(events_element.text);
//   }

type timeRange = {
	start: Dayjs;
	end: Dayjs;
};

function generateBody(range: timeRange, sessionData: SessionData) {
	return JSON.stringify({
		data: {
			'javax.faces.partial.ajax': 'true',
			'javax.faces.source': 'funcForm:j_idt361:content',
			'javax.faces.partial.execute': 'funcForm:j_idt361:content',
			'javax.faces.partial.render': 'funcForm:j_idt361:content',
			'funcForm:j_idt361:content': 'funcForm:j_idt361:content',
			'funcForm:j_idt361:content_start': range.start.unix(),
			'funcForm:j_idt361:content_end': range.end.unix(),
			funcForm: 'funcForm',
			'rx-token': sessionData.rx_token,
			'rx-loginKey': sessionData.rx_login_key,
			'rx-deviceKbn': '1',
			'rx-loginType': 'Gakuen',
			'funcForm:j_idt162_activeIndex': '0',
			'funcForm:j_idt361:j_idt1767:j_idt1767_input': '2022/12/16',
			'funcForm:j_idt361:content_view': 'month',
			'funcForm:j_idt361:j_idt2402:0:jugyoMemo': '',
			'funcForm:j_idt361:j_idt2402:1:jugyoMemo': '',
			'funcForm:j_idt361:j_idt2402:2:jugyoMemo': '',
			'funcForm:j_idt361:j_idt2402:3:jugyoMemo': '',
			'funcForm:j_idt361:j_idt2402:4:jugyoMemo': '',
			'funcForm:j_idt361:j_idt2402:5:jugyoMemo': '',
			'funcForm:j_idt361:j_idt2402:6:jugyoMemo': '',
			'funcForm:j_idt361:j_idt2402:7:jugyoMemo': '',
			'funcForm:j_idt361_activeIndex': '1',
			'javax.faces.ViewState': sessionData.javax_faces_view_state,
		},
	});
}

@Injectable()
export class EventsService {
	async getList(username: string, password: string, start: Dayjs, end: Dayjs): Promise<string> {
		const session_data = await getSessionData('A22DC030', 'courange1013');
		const res = await fetch(API_URL, {
			method: 'POST',
			body: generateBody({start, end}, session_data),
		});
		return 'test';
	}
}
