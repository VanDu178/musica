# Build React app
FROM node:lts as build
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# Serve with `serve`
FROM node:lts
WORKDIR /app

# Cài serve
RUN npm install -g serve

# Copy build từ stage trước
COPY --from=build /app/build .

# Mặc định `serve` sẽ chạy ở cổng 3000
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]
