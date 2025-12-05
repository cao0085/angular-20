# Use the official Node.js 22 image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 4040
EXPOSE 4040

# Command to run the application
CMD ["npm", "start"]
