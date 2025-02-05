FROM node:alpine as build-stage

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npm run build

FROM node:alpine as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm config set registry https://registry.npmmirror.com/

COPY prisma ./prisma/
COPY .env.production ./.env.production
COPY entrypoint.sh ./entrypoint.sh

RUN npm install --production

RUN chmod +x ./entrypoint.sh

RUN npx prisma generate

ENV NODE_ENV=production

# 同步数据库
# RUN npx dotenv -e .env.production -- npx prisma migrate deploy

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]