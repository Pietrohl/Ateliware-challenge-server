FROM node:16

WORKDIR  /app

COPY package*.json ./

COPY src ./src

RUN npm ci

RUN npm run build

COPY ./dist ./

CMD ["npm", "start"]