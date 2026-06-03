# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# copy frontend package files
COPY frontend/package*.json ./
RUN npm install

# copy frontend source
COPY frontend ./

# build Vite app
RUN npm run build


# Production stage (Nginx)
FROM nginx:1.27-alpine

# copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# expose nginx port
EXPOSE 80

# start nginx
CMD ["nginx", "-g", "daemon off;"]
