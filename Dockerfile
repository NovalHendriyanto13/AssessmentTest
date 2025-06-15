FROM node:20-slim

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Install ts-node globally (optional, for dev/debug)
RUN npm install -g ts-node-dev
RUN npm install --save-dev @types/express @types/body-parser @types/mongoose

# Copy your app
COPY . .

# Default command
CMD ["npm", "run", "dev"]
