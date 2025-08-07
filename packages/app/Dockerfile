FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for development)
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

ENV NEXT_TELEMETRY_DISABLED=1

# Start in development mode
CMD ["npm", "run", "dev"]
