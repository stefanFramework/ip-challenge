FROM node:18-alpine

ENV PORT=3000

WORKDIR /usr/src/app

COPY --chown=node:node ./app/package*.json .

RUN npm install --force

COPY --chown=node:node ./app .

EXPOSE $PORT

CMD [ "npm", "run", "start:dev"]