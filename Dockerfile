FROM node:16

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install ffmpeg --yes

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD [ "node", "src/index.js" ]