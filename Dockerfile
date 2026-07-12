FROM --platform=linux/amd64 php:7.4-fpm

# Point to Debian archive since bullseye has been moved off active mirrors
RUN rm -f /etc/apt/sources.list.d/* \
    && echo "deb http://archive.debian.org/debian bullseye main" > /etc/apt/sources.list \
    && echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/10no--check-valid-until

# System deps + PHP extensions
RUN apt-get update && apt-get install -y \
    git curl zip unzip \
    libpng-dev libonig-dev libxml2-dev libicu-dev libzip-dev \
    libjpeg62-turbo-dev libfreetype6-dev \
    ca-certificates \
    && update-ca-certificates \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd intl xml zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer 1.x — required for Laravel 5.8's old dependency tree
COPY --from=composer:2.2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Fresh Laravel 5.8 install, skipping dev deps to avoid the
# phpunit/phpunit 7.5.x security-advisory block
RUN COMPOSER_MEMORY_LIMIT=-1 composer create-project laravel/laravel . "5.8.*" \
    --prefer-dist \
    --no-interaction \
    --no-dev \
    --ignore-platform-reqs

# Permissions for storage & cache
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]