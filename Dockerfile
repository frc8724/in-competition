FROM node:16-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY . .

RUN yarn install && yarn build

CMD ["yarn", "start"]