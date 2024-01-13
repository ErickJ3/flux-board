FROM node:16-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY package*.json ./
COPY prisma ./prisma/

RUN npm i --force
RUN npm ci --force
RUN npx prisma generate

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production --force

FROM node:16-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/
COPY --from=builder --chown=node:node /home/node/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start:migrate:prod"]