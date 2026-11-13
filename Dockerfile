FROM node:22-alpine
WORKDIR /app
COPY package.json openapi.json ./
COPY src ./src
COPY data ./data
ENV HOST=0.0.0.0 PORT=43187 NODE_ENV=production
USER node
EXPOSE 43187
CMD ["node", "src/server.js"]
