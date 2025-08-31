FROM php:8.3-cli AS base

# Install system dependencies + PHP extensions
RUN apt-get update && apt-get install -y \
    libxml2-dev \
    zip unzip git \
    && docker-php-ext-install pdo pdo_mysql dom \
    && pecl install redis \
    && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy app files
COPY . .

# Install dependencies
RUN composer install \
    && composer require illuminate/redis \
    && composer require tymon/jwt-auth

# Generate JWT secret automatically
RUN php artisan jwt:secret --force || true

# ==========================
# Runtime stage
# ==========================
FROM base AS runtime

EXPOSE 8000
CMD php artisan migrate:fresh --seed --force && \
    php -S 0.0.0.0:8000 -t public

# ==========================
# Test stage
# ==========================
FROM base AS test

CMD ["./vendor/bin/phpunit", "--testdox"]
