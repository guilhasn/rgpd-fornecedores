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

# Install Dependencies (triggers postinstall -> prisma generate)
# Using npm ci would be better if lockfile existed, but npm install is fine here
RUN npm install

# Explicitly Generate Prisma Client again to be 100% sure it exists in this layer
RUN npx prisma generate

# Copy Source Code (respects .dockerignore)
COPY . .

# Build the Application
RUN npm run build

# Expose Port
EXPOSE 3001

# Start Command
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npm start"]