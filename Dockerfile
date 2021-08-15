FROM python:3.9-buster

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install ffmpeg --yes

ENV POETRY_VERSION "1.1.7"
ENV POETRY_NO_INTERACTION 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PIP_NO_CACHE_DIR "off"
ENV PIP_DISABLE_PIP_VERSION_CHECK "on"
ENV PATH "/root/.local/bin:$PATH"

RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/install-poetry.py | python -
RUN poetry --version

COPY poetry.lock pyproject.toml ./
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev

COPY . .

CMD [ "python", "main.py" ]
