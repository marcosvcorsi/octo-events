FROM node:16 AS builder

WORKDIR /app

COPY ./package*.json ./
COPY ./prisma ./prisma

RUN npm ci

COPY . .

RUN npm run build && npm prune --production

FROM node:16

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

CMD [ "npm", "start" ]