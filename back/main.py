from fastapi import FastAPI, HTTPException
import scraping as scraper
from datetime import date
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/get_dhu_event_list")
async def get_dhu_event_list(importRange: str, username: str, password: str):
    if (not is_correct_import_range(importRange)):
        return HTTPException(
            status_code=400,
            detail=f"importRange {importRange} is not correct")
    (start, end) = get_range(importRange)
    if (start is None or end is None):
        return HTTPException(
            status_code=500,
            detail="please tell cou about 'error in get_range'")
    return scraper.get_dhu_event_list(
        username,
        password,
        start,
        end)


def get_range(importRange: str):
    if (importRange == "1q" or importRange == "1q_and_2q"):
        return (date(2022, 4, 1), date(2022, 6, 4))
    elif (importRange == "2q"):
        return (date(2022, 6, 1), date(2022, 8, 10))
    elif (importRange == "3q" or importRange == "3q_and_4q"):
        return (date(2022, 9, 20), date(2022, 11, 30))
    elif (importRange == "4q"):
        return (date(2022, 11, 20), date(2023, 3, 20))


def is_correct_import_range(importRange: str):
    return (importRange == "1q" or
            importRange == "2q" or
            importRange == "3q" or
            importRange == "4q" or
            importRange == "1q_and_2q" or
            importRange == "3q_and_4q")
