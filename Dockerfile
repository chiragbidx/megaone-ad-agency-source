FROM node:20-alpine

# Install only git; use --no-cache to keep image lean
RUN apk add --no-cache git

WORKDIR /app

COPY . .

EXPOSE 8080

CMD ["node", "scripts/static-supervisor.js"]
