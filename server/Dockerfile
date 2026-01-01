FROM node:20-bookworm-slim

# 1. Install System Dependencies
# OpenSSL is required for Prisma Client
RUN apt-get update -y && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2. Copy Package Definition
COPY package*.json ./

# 3. Install Dependencies
# Using npm install instead of ci to be more forgiving if lockfile is missing
RUN npm install

# 4. Copy Source Code
COPY . .

# 5. Generate Prisma Client
# This must be done before the build so the types exist
RUN npx prisma generate

# 6. Build the Application
# This runs 'tsc', creating the 'dist' folder
RUN npm run build

# 7. Expose Port
EXPOSE 3001

# 8. Start Command
# - Applies migrations
# - Starts the node application from the build artifact
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npm start"]