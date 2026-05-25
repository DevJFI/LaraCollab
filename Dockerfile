FROM php:8.3-apache

# Instala dependências de sistema e extensões PDO
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev zip unzip git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql gd \
    && docker-php-ext-enable pdo_mysql

# Ajusta o Apache para a pasta /public
RUN a2enmod rewrite && \
    sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html