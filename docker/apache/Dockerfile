FROM php:8.1-apache

RUN apt-get update && apt-get install -y \
    libzip-dev \
    libpq-dev \
    unzip \
 && docker-php-ext-install pdo pdo_pgsql zip

RUN a2enmod rewrite
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

COPY docker/apache/php.ini /usr/local/etc/php/


COPY src/ /var/www/html/
