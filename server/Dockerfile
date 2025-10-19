# Use an LTS Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Only copy package manifests first for better layer caching
COPY package*.json ./

# Install prod deps
RUN npm ci --omit=dev

# Copy the rest of the source
COPY . .

# Environment
ENV NODE_ENV=production

# (Optional) Cloud Run ignores EXPOSE, but it’s fine to document it
EXPOSE 8080

# Start the server (change to server.cjs if you used CommonJS)
CMD ["node", "server.js"]