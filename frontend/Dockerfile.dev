# Use full-feature Node.js (NOT slim)
FROM node:20.19.0

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Ensure dependencies install cleanly
RUN npm install

# Expose Vite default port
EXPOSE 5173

# Set NODE_OPTIONS to include OpenSSL fallback
ENV NODE_OPTIONS="--openssl-legacy-provider"

# Run Vite dev server
CMD ["npm", "run", "dev"]
