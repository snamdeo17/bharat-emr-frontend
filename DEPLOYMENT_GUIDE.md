# Bharat EMR Frontend - Production Deployment Guide

## Table of Contents
1. [Docker Deployment](#docker-deployment)
2. [Cloud Deployment Options](#cloud-deployment-options)
3. [Environment Configuration](#environment-configuration)
4. [CI/CD Setup](#cicd-setup)
5. [Performance Optimization](#performance-optimization)
6. [Monitoring & Logging](#monitoring--logging)

## Docker Deployment

### Build Docker Image
```bash
docker build -t bharat-emr-frontend:latest .
```

### Run Single Container
```bash
docker run -p 3000:3000 \
  -e VITE_API_BASE_URL=http://localhost:8080/api \
  bharat-emr-frontend:latest
```

### Using Docker Compose (Complete Stack)
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f frontend
```

## Cloud Deployment Options

### 1. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_API_BASE_URL
```

### 2. Netlify Deployment
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Continuous deployment from Git
netlify connect
```

### 3. AWS Amplify
```bash
# Install AWS Amplify CLI
npm i -g @aws-amplify/cli

# Configure
amplify configure

# Deploy
amplify publish
```

### 4. Azure App Service
```bash
# Create resource group
az group create --name bharat-emr --location eastus

# Create App Service plan
az appservice plan create --name bharat-plan --resource-group bharat-emr --sku B1 --is-linux

# Create web app
az webapp create --resource-group bharat-emr --plan bharat-plan --name bharat-frontend --runtime "node|18-lts"
```

### 5. Google Cloud Run
```bash
# Build image
gcloud builds submit --tag gcr.io/PROJECT_ID/bharat-emr-frontend

# Deploy to Cloud Run
gcloud run deploy bharat-emr-frontend \
  --image gcr.io/PROJECT_ID/bharat-emr-frontend \
  --platform managed \
  --region us-central1
```

## Environment Configuration

### Production Environment Variables
```env
# API Configuration
VITE_API_BASE_URL=https://api.bharat-emr.com/api

# Application Configuration
VITE_APP_NAME=Bharat EMR
VITE_APP_VERSION=1.0.0

# Security
VITE_SECURE_COOKIES=true
VITE_SAME_SITE=Strict

# Performance
VITE_ENABLE_CACHE=true
VITE_CACHE_TTL=3600

# Logging
VITE_LOG_LEVEL=error
VITE_ENABLE_ANALYTICS=true
```

## CI/CD Setup

### GitHub Actions Workflow
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Performance Optimization

### 1. Code Splitting
- Routes are automatically code-split with React Router
- Components are lazy-loaded on demand

### 2. Bundle Analysis
```bash
# Analyze bundle size
npm run build -- --analyze
```

### 3. Compression
- Gzip compression enabled by default
- Assets are minified and optimized

### 4. Caching Strategy
```javascript
// Service Worker caching
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll(['/index.html', '/main.js']);
    })
  );
});
```

## Monitoring & Logging

### 1. Application Performance Monitoring
```javascript
// Example with error tracking
import { logError } from './utils/errorHandler';

try {
  // Application code
} catch (error) {
  logError(error, 'ComponentName');
}
```

### 2. Health Checks
```bash
# Docker health check endpoint
GET /health

# Returns
{
  "status": "healthy",
  "timestamp": "2025-01-04T11:00:00Z"
}
```

### 3. Logging Services Integration

#### Datadog
```javascript
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: 'YOUR_APP_ID',
  clientToken: 'YOUR_CLIENT_TOKEN',
  site: 'datadoghq.com',
  service: 'bharat-emr-frontend',
  env: 'production',
});
```

#### Sentry
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

## Security Checklist

- ✅ HTTPS enabled
- ✅ Security headers configured
- ✅ CORS properly configured
- ✅ JWT tokens in HTTP-only cookies
- ✅ Environment variables not exposed
- ✅ Sensitive data encrypted
- ✅ Regular security audits
- ✅ Dependency updates automated

## Rollback Procedure

```bash
# Docker rollback
docker service update --image OLD_IMAGE_HASH service_name

# Git rollback
git revert COMMIT_HASH
git push

# Vercel rollback
vercel rollback
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (nginx, AWS ELB)
- Deploy multiple instances
- Share session state (Redis)

### Vertical Scaling
- Increase server resources
- Optimize code performance
- Implement caching strategies

## Support & Troubleshooting

For deployment issues, check:
1. Environment variables configuration
2. Backend API connectivity
3. SSL/TLS certificate validity
4. Docker logs: `docker logs container_name`
5. Application logs in `/var/log/application.log`

---

**Last Updated**: 2025-01-04
**Production Status**: Ready
