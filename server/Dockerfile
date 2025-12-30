FROM node:20-bookworm-slim

# Install OpenSSL and ca-certificates (Required for Prisma)
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies (clean install)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client (Must be done before build)
RUN npx prisma generate

# Build the application (Transpile TS to JS)
RUN npm run build

# Expose the API port
EXPOSE 3000

# Start command:
# 1. Run migrations to ensure DB is ready
# 2. Start the application
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npm start"]