FROM node:16

WORKDIR  /app

COPY package*.json ./
COPY src ./src
COPY . .

RUN npm ci

RUN npm run build

CMD ["npm", "start"]