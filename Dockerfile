FROM node:14-alpine
WORKDIR /app
COPY ./app/package.json ./
COPY ./app/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
EXPOSE 9000
