FROM node:20-alpine

WORKDIR /app

# install dependencies
COPY backend/package*.json ./
RUN npm install --omit=dev

# copy backend source
COPY backend/src ./src
COPY backend/seed ./seed

# create uploads folder
RUN mkdir -p uploads

# expose backend port
EXPOSE 5000

# start server
CMD ["node", "src/server.js"]
