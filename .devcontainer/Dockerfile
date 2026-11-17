# Start with the official PHP 8.2 image that includes Apache
FROM php:8.2-apache

# 1. Install system dependencies and Node.js v20
RUN apt-get update && apt-get install -y \
    sudo \
    git \
    unzip \
    wget \
    mariadb-client \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libzip-dev \
    # Install Node.js v20 using the official NodeSource script
    && curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - \
    && apt-get install -y nodejs \
    # Clean up APT cache
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 2. Install common PHP extensions required by WordPress
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd mysqli opcache zip pdo pdo_mysql

# 3. COPY a custom PHP config file to increase memory limits
COPY uploads.ini /usr/local/etc/php/conf.d/uploads.ini

# 4. Configure Apache to enable pretty permalinks
RUN a2enmod rewrite

# 5. Create a non-root 'vscode' user for Codespaces with passwordless sudo
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN groupadd --gid $USER_GID vscode && \
    useradd -s /bin/bash --uid $USER_UID --gid $USER_GID -m vscode && \
    echo vscode ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/vscode && \
    chmod 0440 /etc/sudoers.d/vscode

# 6. Switch to the non-root user
USER vscode
