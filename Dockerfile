# Multi-stage build for Vue State Lab
FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./
COPY apps/*/package.json ./apps/
COPY packages/*/package.json ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
# Copy entire workspace structure from deps to preserve pnpm symlinks
COPY --from=deps /app ./
# Copy source code (overwrites package.json but preserves node_modules structure)
COPY . .
# Reinstall to fix any broken symlinks after copying source
RUN pnpm install --frozen-lockfile

# Build argument for app name and port
ARG APP_NAME=props
ARG PORT=3001

# Build specific app
RUN pnpm run build --filter=${APP_NAME}

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Build arguments
ARG APP_NAME=props
ARG PORT=3001

# Create apps directory and copy built app
RUN mkdir -p ./apps
COPY --from=builder /app/apps/${APP_NAME} ./apps/${APP_NAME}
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/turbo.json ./
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose port
EXPOSE ${PORT}

# Start the specific app
# Note: docker-compose will override CMD, so we keep WORKDIR at /app
WORKDIR /app
CMD ["pnpm", "run", "dev", "--filter=${APP_NAME}"]
