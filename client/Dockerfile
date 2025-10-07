# frontend/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# Use Vite for development
CMD ["npm", "run", "dev", "--", "--host"]
