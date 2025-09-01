# IIS Deployment Guide for Windows

## Prerequisites

### 1. Install Node.js and npm
1. Download Node.js from: https://nodejs.org/en/download/
2. Choose the "LTS" (Long Term Support) version
3. Run the installer (.msi file) as Administrator
4. During installation, ensure "Add to PATH" is checked
5. Restart your computer after installation
6. Verify installation by opening Command Prompt or PowerShell and running:
   ```cmd
   node --version
   npm --version
   ```

### 2. Install IIS and Required Components
1. Open "Turn Windows features on or off" (search in Start menu)
2. Enable "Internet Information Services"
3. Under IIS, ensure these are checked:
   - Web Management Tools → IIS Management Console
   - World Wide Web Services → Common HTTP Features (all items)
   - World Wide Web Services → Application Development Features → ISAPI Extensions & ISAPI Filters

### 3. Install URL Rewrite Module
1. Download from: https://www.iis.net/downloads/microsoft/url-rewrite
2. Run the installer as Administrator
3. This is **critical** for React Router to work properly

### 4. Install Git (Optional but Recommended)
1. Download from: https://git-scm.com/download/win
2. Install with default settings
3. This allows you to easily clone/download the project

## Deployment Steps

### 1. Download the Project
**Option A: If you have the project files locally**
- Ensure you have all project files in a folder

**Option B: If downloading from Git repository**
```cmd
git clone [your-repository-url]
cd [project-folder-name]
```

### 2. Build the Project

**Using Command Prompt:**
```cmd
# Navigate to your project folder
cd C:\path\to\your\project

# Install dependencies
npm install

# Build the project for production
npm run build
```

**Using PowerShell:**
```powershell
# Navigate to your project folder
Set-Location "C:\path\to\your\project"

# Install dependencies
npm install

# Build the project for production
npm run build
```

**Build Process Explanation:**
- `npm install` downloads all required dependencies (may take a few minutes)
- `npm run build` creates an optimized production build in the `dist` folder
- The `dist` folder contains all files needed for deployment

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