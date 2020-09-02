FROM node:12

WORKDIR /usr/src/app

RUN apt-get update
RUN apt-get install ffmpeg --yes

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

CMD [ "node", "dist/index.js" ]