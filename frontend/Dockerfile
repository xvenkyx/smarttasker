# # Build stage
# FROM node:20 as builder

# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build

# # Serve stage
# FROM nginx:alpine

# COPY --from=builder /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]

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
