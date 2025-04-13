# Stage 1: Build ứng dụng - sử dụng node image
FROM node:20.17.0-alpine as builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy các file cần thiết để cài đặt dependencies
COPY package.json package-lock.json ./

# Cài đặt dependencies (bao gồm cả devDependencies để build)
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Build ứng dụng với production mode
RUN npm run build

# Stage 2: Serve ứng dụng - sử dụng nginx image nhẹ
FROM nginx:stable-alpine as production

# Xóa cache APK để giảm kích thước image
RUN rm -rf /var/cache/apk/*

# Copy cấu hình Nginx tối ưu cho React
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Xóa nội dung mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy các file đã build từ stage builder
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 (HTTP)
EXPOSE 80

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]