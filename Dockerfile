FROM node:22-slim

RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*
RUN npm install -g hyperframes && hyperframes build

WORKDIR /app
COPY package.json ./
RUN npm install

COPY server.js ./
EXPOSE 3000
CMD ["node", "server.js"]
