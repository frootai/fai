FROM node:22-alpine AS base

# ── Metadata ──────────────────────────────────────────────
LABEL org.opencontainers.image.source="https://github.com/frootai/frootai"
LABEL org.opencontainers.image.description="FrootAI MCP Server — 25 tools, 100 solution plays, 830+ primitives, 18 knowledge modules"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.version="3.5.0"
LABEL org.opencontainers.image.vendor="FrootAI"
LABEL org.opencontainers.image.title="frootai-mcp"
LABEL org.opencontainers.image.url="https://frootai.dev/mcp-tooling"

# ── Build stage ───────────────────────────────────────────
FROM base AS build
WORKDIR /app

# Copy package files first for layer caching
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts 2>/dev/null || npm install --omit=dev 2>/dev/null || true

# ── Production stage ──────────────────────────────────────
FROM base AS production
WORKDIR /app

# Copy dependencies from build stage
COPY --from=build /app/node_modules ./node_modules

# Copy application files
COPY package.json ./
COPY index.js ./
COPY cli.js ./
COPY knowledge.json ./
COPY agent-card.json ./
COPY registry-entry.json ./

# Non-root user for security
RUN addgroup -g 1001 -S frootai && \
    adduser -S frootai -u 1001 -G frootai
USER frootai

# ── Environment ───────────────────────────────────────────
ENV NODE_ENV=production
ENV FROOTAI_VERSION=3.5.0

# Health check — verify knowledge.json loads
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "const k=require('./knowledge.json'); if(!k.modules) process.exit(1); console.log('OK:', Object.keys(k.modules).length, 'modules')" || exit 1

# ── Expose & Run ──────────────────────────────────────────
# MCP servers use stdio by default, port 3000 for HTTP mode
EXPOSE 3000

# Default: run as MCP server (stdio)
# Override with: docker run frootai-mcp node cli.js <command>
ENTRYPOINT ["node", "index.js"]
