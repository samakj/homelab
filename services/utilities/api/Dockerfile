FROM python:3.10-alpine

ARG UTILITIES_API_PORT

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt

COPY . /app

EXPOSE $UTILITIES_API_PORT

CMD ["sh", "/app/run.sh"]