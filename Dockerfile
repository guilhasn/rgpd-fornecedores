# Build Stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package.json only (ignoring lockfiles to ensure fresh resolution of the fixed dependency)
COPY package.json ./

# Install dependencies using npm (generating a fresh package-lock.json)
# We avoid 'npm ci' here because we just changed package.json and don't have a matching lockfile committed yet
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]