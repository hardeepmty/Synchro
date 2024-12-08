FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN apt-get update && apt-get install -y \
    g++ \
    build-essential \
    python3.11 \
    python3-pip \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*

RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.11 1

RUN python --version && java --version

COPY . .

COPY .env .env

EXPOSE 5000

CMD ["node", "server.js"]
