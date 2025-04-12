# Base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the app (uncomment for production)
# RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "start"]

# For production, use the following instead:
# CMD ["npm", "run", "serve"]