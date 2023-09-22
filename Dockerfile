FROM node:18-alpine3.17

WORKDIR /usr/src/app
RUN apk add g++ make
COPY package.json package-lock.json ./
RUN npm install

ENV PORT=3000
COPY . .
RUN npm run build

EXPOSE $PORT
CMD ["/bin/sh", "-c", "node dist/src/main"]
