FROM node:20-bookworm-slim

RUN npm install -g pnpm@9.15.0

WORKDIR /app

EXPOSE 8080
