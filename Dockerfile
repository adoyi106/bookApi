#Build stage
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm run build 

# Production stage
FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main.js"]