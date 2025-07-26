FROM php:8.2-apache

WORKDIR /var/www/html

RUN apt-get update && \
    apt-get install -y libpq-dev && \
    docker-php-ext-install pgsql pdo_pgsql pdo && \
    a2enmod rewrite

# Create apache config
RUN echo "<Directory /var/www/html>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    DirectoryIndex productmanagement.php\n\
</Directory>" > /etc/apache2/conf-available/local.conf && \
    a2enconf local