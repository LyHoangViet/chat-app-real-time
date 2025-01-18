FROM node:16

WORKDIR /app

COPY package*.json ./

# Xóa node_modules và package-lock.json nếu có
RUN rm -rf node_modules package-lock.json

# Cài đặt build tools
RUN apt-get update && apt-get install -y \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Cài đặt dependencies với --build-from-source
RUN npm install --build-from-source bcrypt
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]