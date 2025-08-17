FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build --configuration=production

FROM nginx:alpine

COPY --from=builder /app/dist/sistemas-ventas-kcl-giri5091-app /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf