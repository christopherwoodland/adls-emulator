FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY src ./src

EXPOSE 10000

ENV PORT=10000
ENV NODE_ENV=production

CMD ["node", "src/server.js"]
