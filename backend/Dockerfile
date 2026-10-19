# ---- Build stage: install dependencies and generate the Prisma client ----
FROM node:20-alpine AS build
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate

# ---- Runtime stage: small image, non-root user ----
FROM node:20-alpine AS runtime
RUN apk add --no-cache openssl
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY package.json ./
COPY prisma ./prisma
COPY src ./src
USER node
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1
CMD ["node", "src/server.js"]