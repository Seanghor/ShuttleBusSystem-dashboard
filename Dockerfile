FROM node:buster-slim AS builder
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install
ENV NEXT_TELEMETRY_DISABLED 1

RUN pnpm build

FROM node:buster-slim AS runner
WORKDIR /app
RUN npm install -g pnpm
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# USER nextjs

EXPOSE 4000

ENV PORT 4000

CMD ["pnpm", "start"]

