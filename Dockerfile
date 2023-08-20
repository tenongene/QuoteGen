FROM node:20-bullseye-slim
WORKDIR /app
COPY . .
EXPOSE 7272
CMD ["node", "index.js"]

