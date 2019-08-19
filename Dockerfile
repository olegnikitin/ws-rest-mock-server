FROM node:12.2-alpine

# Create app directory
WORKDIR /usr/src/app

#COPY package*.json ./
#COPY .npmrc .
RUN npm install
RUN mkdir /data
#RUN chown -RP node
COPY . .

USER node

EXPOSE 8044 5080
VOLUME /data

CMD ["node", "--experimental-modules", "index.mjs"]
