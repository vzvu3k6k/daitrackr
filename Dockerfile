# Build assets
FROM node:8 AS builder
WORKDIR /usr/src/app
COPY . ./
RUN npm install && npm run build

# Start service
FROM node:8
ENV NODE_ENV=production
ENV HOST=${HOST:-0.0.0.0}
WORKDIR /usr/src/app
COPY . ./
RUN npm install --only=production && npm cache clean --force
COPY --from=builder /usr/src/app/public/css /usr/src/app/public/css

CMD ["npm", "start"]
