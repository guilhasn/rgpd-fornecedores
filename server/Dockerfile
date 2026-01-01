FROM node:20-bookworm-slim

# Install System Dependencies
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Package Definition
COPY package*.json ./

# Copy Prisma Schema
COPY prisma ./prisma/

# Install Dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy Source Code
COPY . .

# Build the Application
RUN npm run build

# Expose Port
EXPOSE 3001

# Start Command
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm start"]