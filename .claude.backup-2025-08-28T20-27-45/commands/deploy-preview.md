# Deploy Preview

Deploy preview environment for: $ARGUMENTS

## Overview

Creates and manages preview deployments on Vercel for testing features before production.

## Prerequisites

- Vercel CLI installed: `npm i -g vercel`
- Vercel account linked: `vercel login`
- GitHub repository connected
- Environment variables configured in Vercel

## Workflow Steps

### PHASE 1: Pre-Deployment Checks

1. **Code Quality Verification**
   ```bash
   # Run all checks
   pnpm verify
   
   # Ensure passing:
   ✓ TypeScript: No errors
   ✓ ESLint: No violations
   ✓ Tests: All passing
   ```

2. **Build Test**
   ```bash
   # Test production build locally
   pnpm build
   
   # Check build output
   ✓ Compiled successfully
   ✓ Route handlers generated
   ✓ Static pages optimized
   ```

3. **Environment Variables**
   ```bash
   # Verify required variables for deployment
   vercel env ls
   
   # Required for preview:
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   CLERK_SECRET_KEY
   DATABASE_URL
   NEXT_PUBLIC_SUPABASE_URL
   ```

### PHASE 2: Create Preview Deployment

1. **Deploy from Current Branch**
   ```bash
   # Deploy current branch to preview
   vercel --no-clipboard
   
   # Or deploy specific branch
   vercel --no-clipboard --git-branch feature/user-profiles
   ```

2. **Deploy with Specific Config**
   ```bash
   # Deploy with environment
   vercel --env DATABASE_URL=$PREVIEW_DATABASE_URL
   
   # Deploy with build command
   vercel --build-command "pnpm build"
   
   # Deploy with custom name
   vercel --name meridian-esg-$ARGUMENTS
   ```

3. **GitHub Integration**
   ```bash
   # Auto-deploy on PR
   # Configure in Vercel dashboard:
   # Settings → Git → Deploy Previews
   ```

### PHASE 3: Database Setup for Preview

1. **Create Preview Database**
   ```bash
   # Create branch database in Supabase
   supabase db branch create preview-$ARGUMENTS
   
   # Get connection string
   supabase db branch show preview-$ARGUMENTS
   ```

2. **Run Migrations**
   ```bash
   # Apply migrations to preview DB
   DATABASE_URL=$PREVIEW_DATABASE_URL pnpm drizzle:push
   ```

3. **Seed Preview Data**
   ```bash
   # Load test data
   DATABASE_URL=$PREVIEW_DATABASE_URL pnpm db:seed
   ```

### PHASE 4: Configure Preview Environment

1. **Set Environment Variables**
   ```bash
   # Set preview-specific variables
   vercel env add NEXT_PUBLIC_APP_URL
   # Enter: https://meridian-esg-preview.vercel.app
   
   vercel env add DATABASE_URL
   # Enter: postgresql://...preview-branch...
   
   vercel env add CLERK_WEBHOOK_URL
   # Enter: https://meridian-esg-preview.vercel.app/api/webhooks/clerk
   ```

2. **Configure Clerk for Preview**
   - Add preview URL to Clerk allowed origins
   - Update webhook endpoint in Clerk dashboard
   - Set redirect URLs for preview environment

### PHASE 5: Deployment Monitoring

1. **Check Deployment Status**
   ```bash
   # List recent deployments
   vercel list
   
   # Check specific deployment
   vercel inspect [deployment-url]
   
   # View logs
   vercel logs [deployment-url]
   ```

2. **Monitor Build Process**
   ```bash
   # Watch build in real-time
   vercel --follow
   ```

3. **Check Functions**
   ```bash
   # List serverless functions
   vercel inspect [deployment-url] --functions
   
   # Check function logs
   vercel logs [deployment-url] --function api/user/sync
   ```

### PHASE 6: Testing Preview

1. **Automated Tests**
   ```bash
   # Run E2E tests against preview
   PREVIEW_URL=https://meridian-esg-preview.vercel.app pnpm test:e2e
   ```

2. **Manual Testing Checklist**
   - [ ] Authentication flow works
   - [ ] Organization switching works
   - [ ] Database operations succeed
   - [ ] API endpoints respond
   - [ ] Static assets load
   - [ ] Environment variables loaded

3. **Performance Testing**
   ```bash
   # Run Lighthouse
   lighthouse https://meridian-esg-preview.vercel.app \
     --output html \
     --view
   ```

### PHASE 7: Preview Management

1. **Share Preview**
   ```bash
   # Get preview URL
   vercel ls --output json | jq '.deployments[0].url'
   
   # Create alias
   vercel alias set [deployment-url] preview-$ARGUMENTS.vercel.app
   ```

2. **Update Preview**
   ```bash
   # Redeploy with changes
   vercel --force
   
   # Promote to production
   vercel --prod
   ```

3. **Clean Up Preview**
   ```bash
   # Remove deployment
   vercel rm [deployment-url]
   
   # Remove preview database
   supabase db branch delete preview-$ARGUMENTS
   ```

## Deployment Configurations

### vercel.json
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "env": {
    "NEXT_TELEMETRY_DISABLED": "1"
  },
  "build": {
    "env": {
      "DATABASE_URL": "@database_url_preview"
    }
  }
}
```

### Preview vs Production

| Setting | Preview | Production |
|---------|---------|------------|
| Database | Branch DB | Main DB |
| Clerk Env | Test keys | Live keys |
| API URL | preview.vercel.app | meridian-esg.com |
| Cache | Disabled | Enabled |
| Logs | Verbose | Error only |

## CI/CD Integration

### GitHub Actions
```yaml
name: Deploy Preview
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Troubleshooting

**Issue**: Build fails on Vercel
```bash
# Check build logs
vercel logs --builds
# Common fixes:
# - Ensure pnpm version matches
# - Check environment variables
# - Verify build command
```

**Issue**: Database connection fails
```bash
# Verify DATABASE_URL
vercel env pull
# Check connection string format
# Ensure SSL mode is correct
```

**Issue**: Clerk authentication not working
```bash
# Verify Clerk keys in Vercel
vercel env ls | grep CLERK
# Update allowed origins in Clerk
# Check webhook configuration
```

## Post-Deployment

After successful deployment:
1. Share preview URL with team
2. Document feature changes
3. Run acceptance tests
4. Gather feedback
5. Plan production deployment

## Quick Commands

```bash
# Most common deployment commands
vercel              # Deploy to preview
vercel --prod      # Deploy to production
vercel ls          # List deployments
vercel logs        # View logs
vercel rm [url]    # Remove deployment
```

## Security Notes

1. **Never** commit sensitive environment variables
2. **Always** use preview-specific database
3. **Rotate** preview API keys regularly
4. **Restrict** preview access if needed
5. **Clean up** old previews to save resources