FROM node:lts-alpine

RUN mkdir -p /usr/src/backend
WORKDIR /usr/src/backend

COPY . .

RUN npm install
RUN npm run build

VOLUME ["usr/src/backend/uploads"]

EXPOSE 3333

CMD ["npm", "run", "start:prod"]
