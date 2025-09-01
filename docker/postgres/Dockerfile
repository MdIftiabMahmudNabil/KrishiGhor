FROM postgres:15-alpine

# Install additional tools
RUN apk add --no-cache \
    curl \
    bash

# Copy initialization scripts
COPY init/ /docker-entrypoint-initdb.d/

# Set permissions for init scripts
RUN chmod +x /docker-entrypoint-initdb.d/*.sh 2>/dev/null || true
RUN chmod +r /docker-entrypoint-initdb.d/*.sql 2>/dev/null || true

# Create directories for custom data
RUN mkdir -p /var/lib/postgresql/backup

# Expose PostgreSQL port
EXPOSE 5432
