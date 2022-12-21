from requests_html import HTMLSession
import xml.etree.ElementTree as ET
import json
from datetime import date
import time
session = HTMLSession()
LOGIN_URL = "https://portal.dhw.ac.jp/uprx/up/pk/pky001/Pky00101.xhtml"

# メールアドレスとパスワードの指定
USER = "A22DC030"
PASS = "textarea"


def get_input_value(res, str):
    return res.html.find(f"input[name='{str}']", first=True).attrs["value"]


def login(username: str, password: str):
    res = session.get(LOGIN_URL)

    # ログイン
    login_info = {
        "loginForm": "loginForm",
        "loginForm:userId": username,
        "loginForm:password": password,
        "loginForm:loginButton": "LOGIN",
        "javax.faces.ViewState": "stateless",
    }

    url_login = "https://portal.dhw.ac.jp/uprx/up/pk/pky001/Pky00101.xhtml/"
    res = session.post(url_login, data=login_info)
    res.raise_for_status()

    return res


def get_form_data(res, start: date, end: date):
    print(
        time.mktime(
            start.timetuple()) *
        1000,
        time.mktime(
            end.timetuple()) *
        1000)
    return {
        "javax.faces.partial.ajax": "true",
        "javax.faces.source": "funcForm:j_idt361:content",
        "javax.faces.partial.execute": "funcForm:j_idt361:content",
        "javax.faces.partial.render": "funcForm:j_idt361:content",
        "funcForm:j_idt361:content": "funcForm:j_idt361:content",
        "funcForm:j_idt361:content_start": int(time.mktime(start.timetuple()) * 1000),
        "funcForm:j_idt361:content_end": int(time.mktime(end.timetuple()) * 1000),
        "funcForm": "funcForm",
        "rx-token": get_input_value(res, "rx-token"),
        "rx-loginKey": get_input_value(res, "rx-loginKey"),
        "rx-deviceKbn": "1",
        "rx-loginType": "Gakuen",
        "funcForm:j_idt162_activeIndex": "0",
        "funcForm:j_idt361:j_idt1767:j_idt1767_input": "2022/12/16",
        "funcForm:j_idt361:content_view": "month",
        "funcForm:j_idt361:j_idt2402:0:jugyoMemo": "",
        "funcForm:j_idt361:j_idt2402:1:jugyoMemo": "",
        "funcForm:j_idt361:j_idt2402:2:jugyoMemo": "",
        "funcForm:j_idt361:j_idt2402:3:jugyoMemo": "",
        "funcForm:j_idt361:j_idt2402:4:jugyoMemo": "",
        "funcForm:j_idt361:j_idt2402:5:jugyoMemo": "",
        "funcForm:j_idt361:j_idt2402:6:jugyoMemo": "",
        "funcForm:j_idt361:j_idt2402:7:jugyoMemo": "",
        "funcForm:j_idt361_activeIndex": "1",
        "javax.faces.ViewState": get_input_value(res, "javax.faces.ViewState"),
    }


def get_dhu_event_list(username: str, password: str, start: date, end: date):
    res = login(username, password)
    # TODO: login失敗時の処理追加
    form_data = get_form_data(res, start, end)

    res = session.post(
        "https://portal.dhw.ac.jp/uprx/up/bs/bsa001/Bsa00101.xhtml",
        data=form_data)
    res.raise_for_status()

    print(res.text)
    res_xml = ET.fromstring(res.text)

    events_element = None

    for updates_element in res_xml[0]:
        if updates_element.attrib['id'] == "funcForm:j_idt361:content":
            events_element = updates_element
            break
    if events_element is None:
        raise Exception(
            "funcForm:j_idt361:content is not found. maybe xml returned by dhu portal is changed.")

    return (json.loads(events_element.text))

# print(get_form_data(login(USER, PASS), date(2022, 9, 1), date(2022, 12, 30)))
# print(get_dhu_event_list(USER, PASS, date(2022, 9, 1), date(2022, 12, 30)))
