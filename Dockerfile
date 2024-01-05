FROM node:18-alpine3.14 

RUN npm i pnpm@8 -g
RUN npm i pm2@5 -g

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY packages/shared/package.json packages/shared/package.json
COPY apps/client/package.json apps/client/package.json
COPY apps/server/package.json apps/server/package.json

RUN pnpm i

COPY . .

RUN pnpm -r build && cp -r /app/apps/client/dist/ /app/apps/server/public/

WORKDIR /app/apps/server

ENV NODE_ENV prod
ENV SERVER_PORT 3000
EXPOSE 3000

CMD ["pm2-runtime", "start", "dist/main.js"]
