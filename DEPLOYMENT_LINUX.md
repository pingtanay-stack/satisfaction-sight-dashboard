# Linux Deployment Guide

## Overview

This React application can be deployed on Linux using various hosting methods. This guide covers multiple deployment strategies from simple static hosting to containerized solutions.

## Prerequisites

### System Requirements
- Linux distribution (Ubuntu 20.04+, CentOS 8+, Debian 10+, RHEL 8+)
- Root or sudo access
- Internet connection for package installation

### Install Node.js and npm

#### Ubuntu/Debian:
```bash
# Update package index
sudo apt update

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### CentOS/RHEL/Fedora:
```bash
# Install Node.js and npm
curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
sudo dnf install -y nodejs npm

# Verify installation
node --version
npm --version
```

#### Using Node Version Manager (NVM) - Recommended:
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install and use latest LTS Node.js
nvm install --lts
nvm use --lts
```

## Build the Application

### 1. Prepare the Project
```bash
# Clone or upload your project
git clone [your-repository-url]
cd [project-folder-name]

# Or if uploading files directly
mkdir /var/www/your-app
cd /var/www/your-app
# Upload your project files here
```

### 2. Install Dependencies and Build
```bash
# Install project dependencies
npm install

# Build for production
npm run build

# The built files will be in the 'dist' directory
ls -la dist/
```

## Deployment Method 1: Nginx (Recommended)

### Install Nginx
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL/Fedora
sudo dnf install nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configure Nginx
```bash
# Create site configuration
sudo nano /etc/nginx/sites-available/your-app

# Add the following configuration:
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/your-app/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
```

### Enable Site and Deploy
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Copy built files to web root
sudo cp -r dist/* /var/www/your-app/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/your-app
sudo chmod -R 755 /var/www/your-app

# Reload Nginx
sudo systemctl reload nginx
```

## Deployment Method 2: Apache

### Install Apache
```bash
# Ubuntu/Debian
sudo apt install apache2

# CentOS/RHEL/Fedora
sudo dnf install httpd

# Start and enable Apache
sudo systemctl start apache2  # or httpd on CentOS/RHEL
sudo systemctl enable apache2  # or httpd on CentOS/RHEL
```

### Configure Apache
```bash
# Create virtual host configuration
sudo nano /etc/apache2/sites-available/your-app.conf  # Ubuntu/Debian
# or
sudo nano /etc/httpd/conf.d/your-app.conf  # CentOS/RHEL
```

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/your-app/dist

    # Enable rewrite module for SPA routing
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]

    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"

    # Cache static assets
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>

    ErrorLog ${APACHE_LOG_DIR}/your-app_error.log
    CustomLog ${APACHE_LOG_DIR}/your-app_access.log combined
</VirtualHost>
```

### Enable Site and Deploy
```bash
# Enable required modules
sudo a2enmod rewrite headers expires  # Ubuntu/Debian

# Enable site (Ubuntu/Debian)
sudo a2ensite your-app.conf

# Copy files and set permissions
sudo cp -r dist/* /var/www/your-app/
sudo chown -R www-data:www-data /var/www/your-app  # Ubuntu/Debian
# or
sudo chown -R apache:apache /var/www/your-app  # CentOS/RHEL

# Test configuration and restart
sudo apache2ctl configtest  # Ubuntu/Debian
sudo systemctl restart apache2  # Ubuntu/Debian
# or
sudo httpd -t  # CentOS/RHEL
sudo systemctl restart httpd  # CentOS/RHEL
```

## Deployment Method 3: Node.js with Express

### Create Express Server
```bash
# Create server directory
mkdir /var/www/your-app-server
cd /var/www/your-app-server

# Initialize npm project
npm init -y

# Install Express
npm install express

# Create server.js
nano server.js
```

```javascript
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### Deploy with PM2 (Process Manager)
```bash
# Install PM2 globally
sudo npm install -g pm2

# Copy built files to server directory
cp -r /path/to/your/project/dist ./

# Start application with PM2
pm2 start server.js --name "your-app"

# Configure PM2 to start on boot
pm2 startup
pm2 save

# Configure reverse proxy (Nginx recommended)
# Add to Nginx config:
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## SSL/HTTPS Setup with Let's Encrypt

### Install Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL/Fedora
sudo dnf install certbot python3-certbot-nginx
```

### Obtain SSL Certificate
```bash
# For Nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# For Apache
sudo certbot --apache -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

## Docker Deployment

### Create Dockerfile
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create nginx.conf for Docker
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Build and Run Docker Container
```bash
# Build image
docker build -t your-app .

# Run container
docker run -d -p 80:80 --name your-app-container your-app

# Or using Docker Compose
# Create docker-compose.yml:
```

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

```bash
# Run with Docker Compose
docker-compose up -d
```

## Cloud Platform Deployment

### AWS EC2
1. Launch EC2 instance (Ubuntu/Amazon Linux)
2. Configure security groups (HTTP/HTTPS ports)
3. Follow the Nginx/Apache setup above
4. Use Elastic Load Balancer for high availability
5. Consider CloudFront CDN for better performance

### DigitalOcean Droplet
1. Create Ubuntu droplet
2. Follow standard Linux deployment steps
3. Use DigitalOcean Load Balancer if needed
4. Consider Spaces for asset storage

### Google Cloud Platform
1. Create Compute Engine instance
2. Configure firewall rules
3. Follow deployment steps
4. Use Cloud Load Balancing for scale

## Security Considerations

### Firewall Configuration
```bash
# UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'  # or 'Apache Full'
sudo ufw enable

# Firewalld (CentOS/RHEL)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### Security Best Practices
- Keep system and packages updated
- Use strong passwords and SSH keys
- Configure fail2ban for brute force protection
- Regular security audits
- Implement CSP headers
- Use HTTPS everywhere
- Regular backups

## Monitoring and Maintenance

### System Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Check system resources
htop
df -h
free -h

# Monitor logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Automated Updates
```bash
# Ubuntu - enable unattended upgrades
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades

# CentOS - enable automatic updates
sudo dnf install dnf-automatic
sudo systemctl enable --now dnf-automatic.timer
```

## Troubleshooting

### Common Issues

1. **404 on page refresh**
   - Check web server configuration for SPA routing
   - Ensure try_files or RewriteRule is configured correctly

2. **Permission denied errors**
   ```bash
   sudo chown -R www-data:www-data /var/www/your-app
   sudo chmod -R 755 /var/www/your-app
   ```

3. **Nginx/Apache not starting**
   ```bash
   # Check configuration syntax
   sudo nginx -t
   sudo apache2ctl configtest
   
   # Check logs
   sudo journalctl -u nginx
   sudo journalctl -u apache2
   ```

4. **SSL certificate issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew certificates
   sudo certbot renew
   ```

5. **High memory usage**
   - Monitor with htop
   - Optimize Nginx/Apache worker processes
   - Enable compression and caching

### Performance Optimization

1. **Enable Gzip compression** (shown in configurations above)
2. **Configure browser caching** for static assets
3. **Use CDN** for global distribution
4. **Optimize images** before deployment
5. **Monitor resource usage** and scale accordingly

### Log Locations
- Nginx: `/var/log/nginx/`
- Apache: `/var/log/apache2/` or `/var/log/httpd/`
- System: `journalctl -u service-name`

## Backup Strategy

### Automated Backups
```bash
#!/bin/bash
# backup-script.sh

BACKUP_DIR="/backup"
APP_DIR="/var/www/your-app"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
tar -czf "$BACKUP_DIR/app-backup-$DATE.tar.gz" -C "$APP_DIR" .

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "app-backup-*.tar.gz" -mtime +7 -delete

# Add to crontab: 0 2 * * * /path/to/backup-script.sh
```

This comprehensive guide should cover most Linux deployment scenarios. Choose the method that best fits your infrastructure and requirements.