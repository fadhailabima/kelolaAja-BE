# Multi-stage build for optimized production image
# Suitable for Railway, VPS, and other production deployments

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

# Install all dependencies (needed for build)
RUN npm ci --quiet

# Copy application source
COPY src ./src
COPY entrypoint.sh ./

# Generate Prisma Client and build TypeScript
RUN npx prisma generate && \
    npm run build && \
    npm prune --production

# Stage 2: Production Runtime
FROM node:18-alpine AS production

WORKDIR /app

# Install runtime dependencies and create user in single layer
RUN apk add --no-cache dumb-init && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    mkdir -p uploads && \
    chown -R nodejs:nodejs uploads

# Copy package files and Prisma schema
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs prisma ./prisma/

# Copy production dependencies from builder
COPY --chown=nodejs:nodejs --from=builder /app/node_modules ./node_modules

# Copy built application and entrypoint
COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist
COPY --chown=nodejs:nodejs --from=builder /app/entrypoint.sh ./entrypoint.sh

# Make entrypoint executable
RUN chmod +x entrypoint.sh

# Switch to non-root user for security
USER nodejs

# Expose application port
EXPOSE 8080

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init for proper signal handling (important for VPS/Kubernetes)
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["./entrypoint.sh"]
