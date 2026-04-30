FROM php:8.3-cli as base

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev coreutils libzip-dev \
    && pecl install redis \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd \
    && docker-php-ext-enable redis

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# -----------------------
# Queue worker
# -----------------------
FROM base AS queue
CMD ["php", "artisan", "queue:work", "--queue=newUserSendEmail", "--sleep=3", "--tries=3"]