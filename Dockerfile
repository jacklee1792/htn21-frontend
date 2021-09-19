FROM node:16-bullseye-slim

RUN mkdir /src

COPY package.json /src
COPY yarn.lock /src
WORKDIR /src

RUN yarn install

COPY . /src

CMD yarn start


