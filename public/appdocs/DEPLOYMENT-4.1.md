# 🚀 Deployment Guide - Love, Actually... The Game

This guide covers deployment options for the couples therapy gaming platform.

## 📋 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Build process successful
- [ ] Tests passing
- [ ] Performance optimized
- [ ] Security measures in place

## 🏗️ Build Process

### Local Build
```bash
npm run build
npm run start
```

### Environment Variables
Ensure all required environment variables are set:
```bash
DATABASE_URL=
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
NEXTAUTH_SECRET=
```

## ☁️ Cloud Deployment Options

### 1. Vercel (Recommended)

**Automatic Deployment:**
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on git push

**Manual Deployment:**
```bash
npm install -g vercel
vercel --prod
```

**Configuration (vercel.json):**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "DATABASE_URL": "@database-url",
    "OPENAI_API_KEY": "@openai-api-key",
    "ELEVENLABS_API_KEY": "@elevenlabs-api-key"
  }
}
```

### 2. Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

**Configuration (netlify.toml):**
```toml
[build]
  publish = ".next"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### 3. Railway

```bash
npm install -g @railway/cli
railway login
railway link
railway up
```

### 4. Heroku

```bash
heroku create love-actually-game
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=your-database-url
git push heroku main
```

**Configuration (Procfile):**
```
web: npm start
```

### 5. DigitalOcean App Platform

**Configuration (.do/app.yaml):**
```yaml
name: love-actually-game
services:
- name: web
  source_dir: /
  github:
    repo: yourusername/love-actually-game
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
```

## 🛢️ Database Setup

### PostgreSQL Options

**1. Vercel Postgres:**
```bash
vercel postgres create
```

**2. Supabase:**
- Create project at supabase.com
- Copy connection string
- Run migrations: `npm run db:push`

**3. Railway PostgreSQL:**
```bash
railway add postgresql
```

**4. Heroku Postgres:**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

### Migration Commands
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Run seeds (optional)
npm run db:seed
```

## 🔧 Performance Optimization

### Next.js Optimizations
```javascript
// next.config.js optimizations included in project
module.exports = {
  images: {
    domains: ['api.elevenlabs.io'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  swcMinify: true,
}
```

### Database Connection Pooling
```javascript
// Prisma connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?connection_limit=5&pool_timeout=0",
    },
  },
})
```

## 🔒 Security Configuration

### Environment Security
- Use environment variables for all secrets
- Never commit API keys to repository
- Use different keys for development/production
- Rotate keys regularly

### HTTPS Configuration
Most cloud providers handle HTTPS automatically. For custom domains:
```bash
# Vercel custom domain
vercel domains add yourdomain.com
```

### Security Headers
Headers are configured in `next.config.js`:
```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        // Additional security headers...
      ],
    },
  ]
}
```

## 📊 Monitoring & Analytics

### Error Tracking (Sentry)
```bash
npm install @sentry/nextjs
```

### Performance Monitoring
- Vercel Analytics (automatic)
- PostHog for user analytics
- Custom monitoring dashboards

### Health Checks
Create monitoring endpoints:
```typescript
// src/app/api/health/route.ts
export async function GET() {
  return Response.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString() 
  })
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions (.github/workflows/deploy.yml)
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=base /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/loveactuallygame
    depends_on:
      - db
  
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: loveactuallygame
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## 🌍 Custom Domain Setup

### DNS Configuration
```
Type    Name    Value
A       @       your-server-ip
CNAME   www     your-app.vercel.app
```

### SSL Certificate
Most platforms handle SSL automatically. For custom setups:
```bash
# Using Certbot
sudo certbot --nginx -d yourdomain.com
```

## 📱 Mobile Optimization

### PWA Configuration
```json
// public/manifest.json
{
  "name": "Love, Actually... The Game",
  "short_name": "LoveGame",
  "theme_color": "#ec4899",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🔍 Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**Database Connection:**
```bash
# Test connection
npm run db:studio
```

**Environment Variables:**
```bash
# Verify environment
echo $DATABASE_URL
```

### Performance Issues
- Check bundle size: `npm run analyze`
- Optimize images and assets
- Enable compression
- Use CDN for static assets

## 📈 Scaling Considerations

### Horizontal Scaling
- Use serverless functions for API routes
- Implement database connection pooling
- Use CDN for static assets
- Consider microservices architecture for high load

### Caching Strategy
- Redis for session storage
- Database query caching
- Static asset caching
- API response caching

## 🚦 Deployment Environments

### Development
```bash
npm run dev
```

### Staging
```bash
npm run build
NODE_ENV=staging npm start
```

### Production
```bash
npm run build
npm start
```

## 📋 Production Checklist

- [ ] SSL certificate configured
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Error tracking enabled
- [ ] Analytics configured
- [ ] Performance monitoring active
- [ ] Backup strategy implemented
- [ ] Domain configured
- [ ] Security headers enabled
- [ ] Load testing completed

Your Love, Actually... The Game platform is now ready for deployment! 🚀💕