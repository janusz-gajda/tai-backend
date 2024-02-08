FROM node:21-alpine
WORKDIR /app
COPY package.json ./
COPY .env.docker ./.env
RUN mkdir "/app/songs"
RUN mkdir "/app/songs/tmp"
RUN yarn install
COPY . .
RUN yarn run build_prisma
RUN yarn run build
EXPOSE 8080
CMD yarn db_pull && yarn start