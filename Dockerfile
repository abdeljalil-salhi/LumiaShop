FROM node:12.4.0

WORKDIR /app

COPY package.json ./

RUN npm install -g npm@6.9.0

RUN npm install

COPY . .

CMD ["npm", "start"]
