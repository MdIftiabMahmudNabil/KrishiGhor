FROM nginx:alpine

# Install additional tools
RUN apk add --no-cache \
    curl \
    openssl

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY site.conf /etc/nginx/conf.d/default.conf

# Create directory for SSL certificates (if needed)
RUN mkdir -p /etc/nginx/ssl

# Create nginx user
RUN adduser -D -s /bin/sh nginx

# Set permissions
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Create directories for logs
RUN mkdir -p /var/log/nginx

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
