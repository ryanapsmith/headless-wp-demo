#!/bin/bash
set -e

# --- Variables ---
REPO_NAME=${localWorkspaceFolderBasename}
WORKSPACE_DIR="/workspaces/${REPO_NAME}"
WP_DIR="/var/www/html"
PLUGIN_DIR="${WP_DIR}/wp-content/plugins/${REPO_NAME}"

echo "🚀 Starting WordPress post-creation setup..."

# --- Start Services ---
echo "Starting Apache service..."
sudo service apache2 start

# --- Install WP-CLI ---
if ! command -v wp &> /dev/null; then
    echo "Installing WP-CLI..."
    wget https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
    chmod +x wp-cli.phar
    sudo mv wp-cli.phar /usr/local/bin/wp
fi

# --- Set up WordPress Core ---
sudo mkdir -p ${WP_DIR}
sudo chown -R vscode:vscode ${WP_DIR}

if [ -f "${WP_DIR}/wp-config.php" ]; then
    echo "WordPress is already configured."
else
    echo "WordPress not found. Installing..."
    
    # The healthcheck in docker-compose ensures the DB is ready, so we can proceed.
    echo "Database is ready!"
    
    wp core download --path=${WP_DIR}

    wp config create \
      --path=${WP_DIR} \
      --dbname=wordpress \
      --dbuser=wordpress \
      --dbpass=password \
      --dbhost=db \
      --force

    CODESPACE_URL="https://${CODESPACE_NAME}-80.app.github.dev"
    wp core install \
      --path=${WP_DIR} \
      --url=${CODESPACE_URL} \
      --title="${REPO_NAME} Dev" \
      --admin_user=admin \
      --admin_password=password \
      --admin_email=dev@example.com \
      --skip-email
fi

# --- Symlink the Plugin ---
echo "Linking repository to wp-content/plugins..."
mkdir -p "${WP_DIR}/wp-content/plugins"
if [ ! -L "${PLUGIN_DIR}" ]; then
    rm -rf "${PLUGIN_DIR}"
    ln -s "${WORKSPACE_DIR}" "${PLUGIN_DIR}"
    echo "✅ Symbolic link created: ${WORKSPACE_DIR} -> ${PLUGIN_DIR}"
fi

# --- Finalize ---
cd ${WP_DIR}
echo "Activating the '${REPO_NAME}' plugin..."
wp plugin activate ${REPO_NAME}

# Fix permissions for the web server and the vscode user
sudo usermod -a -G www-data vscode
sudo chown -R www-data:www-data ${WP_DIR}
sudo chmod -R g+w ${WP_DIR}

echo "🎉 WordPress setup complete!"
echo "URL: https://${CODESPACE_NAME}-80.app.github.dev"
echo "Admin User: admin"
echo "Admin Pass: password"
