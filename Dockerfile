FROM node:22-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.25.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile
COPY index.html server.js ./
COPY src ./src
COPY public ./public
COPY db ./db
COPY scripts ./scripts
COPY server ./server
ENV NODE_ENV=production
EXPOSE 3000
USER node
CMD ["node", "server.js"]
