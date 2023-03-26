#!/bin/sh
cd front && npm run start &
cd back && ./venv/bin/activate.fish && uvicorn main:app --reload &
