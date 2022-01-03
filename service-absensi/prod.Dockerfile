FROM node:15-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install node-schedule --save

RUN npm i date-holidays --save

RUN npm i multer --unsafe-perm=true --allow-root
COPY . .

CMD ["npm", "run", "serve:production"]
