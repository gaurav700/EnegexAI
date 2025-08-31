FROM node:18-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# ==========================
# Runtime stage
# ==========================
FROM base AS runtime

EXPOSE 5000
CMD ["npm", "start"]

# ==========================
# Test stage
# ==========================
FROM base AS test

CMD ["npm", "test"]
