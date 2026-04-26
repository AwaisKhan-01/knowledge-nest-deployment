# Frontend Dockerfile - Multi-stage optimized build for production Kubernetes
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Accept API URL as a build argument
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy application code
COPY . .

# Build the React app with Vite
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install only production HTTP server
RUN npm install -g serve

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Serve the application
CMD ["serve", "-s", "dist", "-l", "3000", "--no-clipboard"]
