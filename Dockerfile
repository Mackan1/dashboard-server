FROM node:13.10-alpine

WORKDIR /var/dashboard-server

COPY modules/ modules/
COPY order-schema.js .
COPY mongo.js .
COPY excludedJp.js .
COPY index.js .
COPY package-lock.json .
COPY package.json .

RUN npm i

CMD [ "npm", "start" ]

EXPOSE 3000
