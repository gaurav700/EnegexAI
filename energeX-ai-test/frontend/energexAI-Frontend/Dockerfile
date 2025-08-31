# Stage 1: Build the frontend with Node
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy everything (including .env.docker)
COPY . .

# Rename .env.docker to .env so Vite uses it in build
RUN cp .env.docker .env

RUN npm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
