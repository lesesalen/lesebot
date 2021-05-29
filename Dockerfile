FROM python:3.9-buster

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install ffmpeg --yes

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "lesebot/lesebot.py" ]
