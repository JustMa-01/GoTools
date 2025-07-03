# Use a specific, stable version of Node on a Debian-based OS
FROM node:18-bullseye-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# --- Install System Dependencies ---
RUN apt-get update && apt-get install -y --no-install-recommends \
    ghostscript \
    libreoffice \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# --- Install Node.js Dependencies ---
# Copy package.json and package-lock.json first
COPY package*.json ./
# Use a standard 'npm install' to ensure all scripts are available
RUN npm install

# --- Copy Application Code ---
COPY . .

# --- Expose Port and Set Environment Variable ---
EXPOSE 3001
ENV PORT=3001

# --- Start Command ---
# Use 'npm start', which now correctly runs 'node server.js'
CMD [ "npm", "start" ]