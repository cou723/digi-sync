FROM python:3.10-slim

RUN pip install --upgrade pip

RUN . venv/bin/activate.sh

EXPOSE 8000

COPY ./app /app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
