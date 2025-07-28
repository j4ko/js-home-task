# Use the official TestCafe image
FROM testcafe/testcafe:latest

# Set working directory
WORKDIR /tests

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy only the test, page objects, utils y configuración necesaria
COPY tests ./tests
COPY pages ./pages
COPY utils ./utils
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY .testcaferc.json ./.testcaferc.json

# Entrypoint script to inject baseUrl and run tests
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# The report will be written to /reports, which should be mounted as a volume
VOLUME ["/reports"]

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
