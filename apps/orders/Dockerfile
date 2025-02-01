FROM node:20.11.0-alpine3.18
WORKDIR /app
COPY package.json ./
RUN npm install -g pnpm && pnpm i
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]
