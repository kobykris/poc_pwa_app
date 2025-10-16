# Build stage
FROM node:22.20.0-alpine AS builder

# Install pnpm
RUN corepack enable

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

ARG VITE_API_URL_ARG
ENV VITE_API_URL=${VITE_API_URL_ARG}

# Build application
RUN pnpm build

# Production stage
FROM nginx:stable-alpine3.21-slim AS production

# Install security updates
RUN apk upgrade --no-cache

# Copy nginx configuration
COPY config/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy built files from builder
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Set proper permissions
# RUN chown -R nginx:nginx /usr/share/nginx/html && \
#     chmod -R 755 /usr/share/nginx/html

# RUN mkdir -p /var/cache/nginx/client_temp && \
#     chown -R nginx:nginx /var/cache/nginx

# Expose port
EXPOSE 80

# Use non-root user
# USER nginx

# Start nginx
CMD ["nginx", "-g", "daemon off;"]