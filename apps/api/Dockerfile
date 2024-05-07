FROM node:20

RUN mkdir -p /app

WORKDIR /app

COPY ../../package.json ./
COPY ../../pnpm-lock.yaml ./

RUN npm install -g pnpm@8

RUN pnpm install

COPY . .

EXPOSE 8000

CMD ["npx", "nx", "run", "api:serve"]
