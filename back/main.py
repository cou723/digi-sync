from fastapi import FastAPI, HTTPException, Response, Request
import scraping as scraper
import os
from datetime import date
from fastapi.middleware.cors import CORSMiddleware
from classes import CannotLoginException
from typing import Tuple, Union
import calendar

app = FastAPI()

origins = [
    "https://dp2gc.vercel.app",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_month_range(start: int, end: int):
    if (start < end):
        return range(start, end)
    else:
        months = []
        for i in range(start, 13):
            months.append(i)
        for i in range(1, end + 1):
            months.append(i)
        return months


@app.get("/")
def root():
    return {"text": "Hello!"}


@app.get("/get_dhu_event_list")
async def get_dhu_event_list(importYear: str, importRange: str, username: str, password: str, response: Response, request: Request):
    if (not is_correct_import_range(importRange)):
        return HTTPException(400, f"importRange '{importRange}' is not correct")
    if (not is_correct_import_year(importYear)):
        return HTTPException(400, f"importYear '{importYear}' is not correct")
    # response.headers["Access-Control-Allow-Origin"] = origins
    (start, end) = get_range_date(importYear, importRange)
    if (start is None or end is None):
        return HTTPException(500, "please tell cou about 'error in get_range'")
    try:
        data = {'events': []}
        pre_month = 0
        year = start.year
        for month in get_month_range(start.month, end.month):
            if (month < pre_month):
                year += 1
            data["events"] += (scraper.get_dhu_event_list(
                username, password,
                year=year, month=month
            )["events"])
            pre_month = month

    except CannotLoginException as e:
        return HTTPException(401, detail=str(e))
    # except Exception as e:
        # return HTTPException(500, detail=str(e))
    return data


def is_correct_import_range(importRange: str) -> bool:
    return (importRange == "1q" or
            importRange == "2q" or
            importRange == "3q" or
            importRange == "4q" or
            importRange == "1q_and_2q" or
            importRange == "3q_and_4q")


def is_correct_import_year(importYear: str) -> bool:
    try:
        int(importYear)
    except:
        return False
    return int(importYear) >= 2022 and int(importYear) <= date.today().year


def get_range_date(importYear: str, importRange: str) -> Tuple[date, date]:
    year = int(importYear)
    _1q_start = date(year, 4, 1)
    _2q_start = date(year, 6, 10)
    _3q_start = date(year, 9, 1)
    _4q_start = date(year, 11, 25)
    _1q_end = date(year, 6, 9)
    _2q_end = date(year, 8, 31)
    _3q_end = date(year, 11, 24)
    _4q_end = date(year+1, 2, calendar.monthrange(year+1, 2)[1])

    if (importRange == "1q"):
        return (_1q_start, _1q_end)
    elif (importRange == "2q"):
        return (_2q_start, _2q_end)
    elif (importRange == "3q"):
        return (_3q_start, _3q_end)
    elif (importRange == "4q"):
        return (_4q_start, _4q_end)
    elif (importRange == "1q_and_2q"):
        return (_1q_start, _2q_end)
    elif (importRange == "3q_and_4q"):
        return (_3q_start, _4q_end)
