# frontend/Dockerfile
# Build stage: compile the React/Vite app
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Production stage: serve with nginx
FROM nginx:alpine

# Remove default nginx content and config
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/nginx.conf

# Copy custom nginx configuration that proxies /api/* to backend
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build artifacts from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose default http port
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
