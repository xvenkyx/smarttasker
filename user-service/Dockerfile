FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5001

CMD ["node", "src/index.js"]
# CMD ["npx", "nodemon", "src/index.js"]

