FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
# If a lockfile exists, copy it too, but we will use npm install to ensure 
# dependencies added to package.json are resolved
COPY package-lock.json* ./

# Install dependencies (using npm install instead of ci to update lockfile logic inside container)
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy custom nginx config if needed (creating a basic one in next step if missing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]