FROM node:11
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8060
CMD [ "npm", "start" ]