FROM node:21-alpine
WORKDIR /app
COPY package.json ./
COPY .env.docker ./.env
RUN yarn install
COPY . .
RUN yarn run build_prisma
RUN yarn run build
EXPOSE 8080
CMD npm start