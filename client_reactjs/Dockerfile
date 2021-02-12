FROM  mhart/alpine-node:14

WORKDIR /client

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
