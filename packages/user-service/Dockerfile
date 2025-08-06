# Dockerfile

FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Build TS just in case
RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
