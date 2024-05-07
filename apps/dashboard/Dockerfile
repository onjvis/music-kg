FROM node:20

RUN mkdir -p /app

WORKDIR /app

COPY ../../package.json ./
COPY ../../pnpm-lock.yaml ./

RUN npm install -g pnpm@8

RUN pnpm install

COPY . .

EXPOSE 4200

CMD ["npx", "nx", "run", "dashboard:serve", "--host", "0.0.0.0"]
