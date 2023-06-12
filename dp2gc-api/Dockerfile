# Use the official Node.js image as the base image
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000 
CMD [ "npm", "run", "start" ]
