# IIS Deployment Guide

## Prerequisites
- IIS with URL Rewrite Module installed
- Node.js (for building the project)

## Deployment Steps

### 1. Build the Project
```bash
npm install
npm run build
```

### 2. Prepare IIS Site
1. Create a new IIS website or use existing
2. Set physical path to your deployment folder
3. Ensure Application Pool is set to "No Managed Code"

### 3. Upload Files
1. Copy all contents from `dist` folder to IIS site root
2. The `web.config` file will be automatically included from the `public` folder

### 4. IIS Configuration Requirements

#### URL Rewrite Module
- Download and install from: https://www.iis.net/downloads/microsoft/url-rewrite
- This is required for React Router to work properly

#### Application Pool Settings
- .NET CLR Version: No Managed Code
- Managed Pipeline Mode: Integrated
- Identity: ApplicationPoolIdentity (or appropriate service account)

#### Site Bindings
- HTTP: Port 80
- HTTPS: Port 443 (recommended with SSL certificate)

### 5. Verify Installation
1. Browse to your site URL
2. Test navigation between pages
3. Verify Excel upload functionality works
4. Check browser console for any errors

## Troubleshooting

### Common Issues:
- **404 on page refresh**: Ensure URL Rewrite Module is installed and web.config is present
- **MIME type errors**: Check that all MIME types are configured in web.config
- **Blank page**: Check browser console for JavaScript errors
- **Upload not working**: Verify file permissions for temp directories

### Performance Optimization:
- Enable static content compression in IIS
- Configure browser caching for static assets
- Consider using a CDN for better global performance

## Security Considerations
- Always use HTTPS in production
- Configure proper security headers (included in web.config)
- Regular security updates for IIS and Windows Server
- Consider implementing CSP (Content Security Policy) headers