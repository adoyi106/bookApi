# Use Node.js v20 base image
FROM node:20
# Set the working directory inside the container
WORKDIR /app
# Copy project files into the container
COPY . /app/
# Install dependencies
RUN npm install
# Build the project
RUN npm run build
# Expose the port your app runs on
EXPOSE 3000
# Start the app
CMD ["node", "dist/main"]