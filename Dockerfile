FROM node:21-alpine
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN apk add --no-cache ffmpeg
WORKDIR /app
COPY package.json ./
COPY .env.docker ./.env
RUN mkdir "/app/songs" && mkdir "/app/songs/tmp"
RUN yarn install
COPY . .
RUN yarn run build_prisma
RUN yarn run build
EXPOSE 8080
CMD yarn db_pull && yarn start