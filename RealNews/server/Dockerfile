# ---- Base image ----
FROM node:20-alpine

# ---- App dir ----
WORKDIR /app

# ---- Install deps (use layer caching) ----
COPY package*.json ./
RUN npm ci --omit=dev

# ---- Copy source ----
COPY . .

# ---- Runtime env ----
ENV NODE_ENV=production

# (Cloud Run uses PORT env; EXPOSE here is just documentation)
EXPOSE 8080

# ---- Start server ----
# Adjust to your entry file (server.js / app.js / dist/server.js)
CMD ["node", "server.js"]
