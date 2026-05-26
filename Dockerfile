FROM php:8.3-apache

# 1. Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev libicu-dev zip unzip git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql gd intl \
    && docker-php-ext-enable pdo_mysql intl

# 2. Instala o Composer globalmente
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 3. Configura o Apache
RUN a2enmod rewrite && \
    sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html

# 4. Copia os arquivos do projeto
COPY . .

# 5. Instala as dependências do Laravel via Composer
RUN composer install --no-dev --optimize-autoloader

# 6. Ajusta permissões
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache