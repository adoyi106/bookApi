#Build stage
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm run build 

# Production stage
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled app from build stage
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main.js"]