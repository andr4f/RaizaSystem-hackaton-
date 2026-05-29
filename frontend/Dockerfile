# ── Build ──
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# ── Serve ──
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Railway inyecta PORT; BACKEND_URL lo defines tú (URL pública del API)
ENV BACKEND_URL=http://localhost:8080

EXPOSE 8080
