# Use a specific, stable version of Node on a Debian-based OS (for apt-get)
FROM node:18-bullseye-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# --- Install System Dependencies ---
# This is the crucial step for your tools to work.
# It installs Ghostscript, LibreOffice, and Poppler.
RUN apt-get update && apt-get install -y --no-install-recommends \
    ghostscript \
    libreoffice \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# --- Install Node.js Dependencies ---
# Copy package.json and package-lock.json first to leverage Docker's build cache
COPY package*.json ./
RUN npm install --production

# --- Copy Application Code ---
# Copy the rest of your backend source code into the container
COPY . .

# --- Expose Port ---
# Tell Railway that your app will be running on port 3001
EXPOSE 3001

# --- Set Environment Variable for Port ---
# Your server.js should use this PORT variable to be flexible.
ENV PORT=3001

# --- Start Command ---
# The command to run when the container starts
CMD [ "npm", "start" ]