FROM node:22-slim

RUN apt-get update && apt-get install -y \
    ffmpeg \
    libnss3 libnspr4 libatk-bridge2.0-0 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 \
    libxrandr2 libgbm1 libasound2 libcups2 \
    libpango-1.0-0 libcairo2 libatspi2.0-0 \
    && rm -rf /var/lib/apt/lists/*
RUN npm install -g hyperframes && hyperframes build

WORKDIR /app
COPY package.json ./
RUN npm install

COPY server.js ./
EXPOSE 3000
CMD ["node", "server.js"]
