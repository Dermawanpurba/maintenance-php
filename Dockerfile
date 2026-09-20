# ==========================================
# Stage 1: Build React Vite Frontend (Node.js 20 Alpine)
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend-react
COPY frontend-react/package*.json ./
RUN npm install
COPY frontend-react/ ./
RUN npm run build

# ==========================================
# Stage 2: PHP 8.4-FPM Alpine + Nginx + Composer + SQLite
# ==========================================
FROM php:8.4-fpm-alpine

# Install system dependencies & PHP extensions
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    git \
    unzip \
    libzip-dev \
    sqlite \
    sqlite-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    icu-dev \
    dos2unix \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_sqlite mbstring zip bcmath gd intl opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application backend files
COPY . .

# Copy built frontend dist to public_frontend
COPY --from=frontend-builder /app/frontend-react/dist /var/www/html/public_frontend

# Install Laravel dependencies (PHP 8.4 compliant, production)
RUN composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-req=php+

# Prepare SQLite Database & Storage directories
RUN mkdir -p /var/www/html/database /var/www/html/storage/app/public /var/www/html/bootstrap/cache /var/www/html/public_frontend \
    && touch /var/www/html/database/database.sqlite \
    && cp -rf /var/www/html/database /var/www/html/database_template \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/database_template /var/www/html/public /var/www/html/public_frontend \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database /var/www/html/database_template

# Copy custom configurations
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

# Fix Windows CRLF line endings & set executable
RUN dos2unix /usr/local/bin/entrypoint.sh /etc/nginx/http.d/default.conf /etc/supervisord.conf /usr/local/etc/php/conf.d/custom.ini \
    && chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
