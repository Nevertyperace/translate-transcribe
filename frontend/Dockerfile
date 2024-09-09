FROM node:latest

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN apt update
RUN apt-get update
RUN apt install npm -y
RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT ["npm", "start", "--host", "0.0.0.0", "--port", "3000"]

