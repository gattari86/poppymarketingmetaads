# Deployment Guide

This guide provides step-by-step instructions for deploying Poppy Marketing Ads Manager to Vercel.

## Prerequisites

- Node.js 18+ installed
- Git account with push access to repository
- Vercel account
- Meta App ID and Secret from https://developers.facebook.com
- Vercel domain routing to subdomain
- OpenSSL or equivalent for generating NEXTAUTH_SECRET

## Step 1: Prepare Environment Variables

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output - you'll need it for Vercel.

### Gather Required Variables

Collect these values from your Meta App:
- `META_APP_ID` - From Meta App Settings
- `META_APP_SECRET` - From Meta App Settings
- `META_SYSTEM_USER_TOKEN` - (Optional, for development bypass)

### Create `.env.local` for Local Testing

```bash
cp .env.example .env.local
```

Fill in values:
```
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_SYSTEM_USER_TOKEN=your_system_user_token
META_GRAPH_VERSION=v20.0
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000
EMAIL_SUPPORT=support@poppymarketingandconsulting.com
EMAIL_INFO=info@poppymarketingandconsulting.com
SUBAPACE_URL=https://api.subapace.com (optional)
SUBAPACE_KEY=your_key (optional)
```

## Step 2: Test Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Visit http://localhost:3000
```

Test all features:
- Facebook login flow
- Ad account loading
- Campaign creation
- Public pages accessibility

## Step 3: Push to GitHub

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit: Poppy Ads Manager"

# Add remote
git remote add origin https://github.com/gattari86/poppymarketingmetaads.git

# Push to main
git branch -M main
git push -u origin main
```

## Step 4: Configure Vercel

### 4.1 Import Project

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Enter: `https://github.com/gattari86/poppymarketingmetaads`
5. Click "Import"

### 4.2 Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

```
META_APP_ID = [your-app-id]
META_APP_SECRET = [your-app-secret]
META_SYSTEM_USER_TOKEN = [optional]
META_GRAPH_VERSION = v20.0
NEXTAUTH_SECRET = [generated-secret]
NEXTAUTH_URL = https://app.poppymarketingandconsulting.com
EMAIL_SUPPORT = support@poppymarketingandconsulting.com
EMAIL_INFO = info@poppymarketingandconsulting.com
SUBAPACE_URL = [optional]
SUBAPACE_KEY = [optional]
```

**Important:** Make sure each variable is only visible in Production.

### 4.3 Configure Custom Domain

1. Go to Settings → Domains
2. Add domain: `app.poppymarketingandconsulting.com`
3. Follow Vercel's DNS configuration instructions
4. Update your DNS provider with the CNAME record

## Step 5: Deploy

### Automatic Deployment

Push to main branch:
```bash
git push origin main
```

Vercel will automatically build and deploy. Check progress at https://vercel.com/dashboard

### Manual Deployment

In Vercel Dashboard:
1. Select your project
2. Click "Deployments"
3. Click "Redeploy" on the latest commit

## Step 6: Post-Deployment Verification

### Checklist

- [ ] Site loads at https://app.poppymarketingandconsulting.com
- [ ] Facebook login redirects correctly
- [ ] Ad accounts load successfully
- [ ] Campaign creation works
- [ ] Ad set creation works
- [ ] Ad creation works
- [ ] Rules creation works
- [ ] Privacy policy page loads
- [ ] Terms page loads
- [ ] Support form submits
- [ ] Data deletion form submits
- [ ] HTTPS is enforced
- [ ] No console errors

### Test with Real Facebook Account

1. Visit https://app.poppymarketingandconsulting.com
2. Click "Continue with Facebook"
3. Authorize with your Meta Business Account
4. Create a test campaign
5. Verify all features work

## Step 7: Meta App Review Submission

### Before Submission

- [ ] All documentation is complete
- [ ] Privacy Policy is live and accessible
- [ ] Terms of Service is live and accessible
- [ ] Data Deletion page is live
- [ ] Support page is live
- [ ] App is fully functional
- [ ] Record screencast walkthrough
- [ ] Gather all required business documents

### Meta App Review Checklist

Go to https://developers.facebook.com and submit for App Review:

1. Click on your app
2. Go to App Roles
3. Add Meta representative (if provided)
4. Go to App Settings → Basic
5. Fill in all required fields:
   - App Name
   - App Description
   - Category
   - App Domains: `app.poppymarketingandconsulting.com`
   - Privacy Policy URL
   - Terms of Service URL
   - Contact Email
6. Go to Permissions & Features
7. Request these permissions:
   - `ads_management` (Standard Access)
   - `business_management` (Standard Access)
   - `pages_show_list` (Standard Access)
   - `pages_read_engagement` (Standard Access)
8. For each permission, provide justification from `docs/permissions-justification.md`
9. Upload screencast video
10. Submit for review

### After Submission

- Meta takes 1-2 weeks to review
- Monitor email for feedback
- Be prepared to address questions
- May need to resubmit if rejected

## Troubleshooting

### Build Fails
```bash
# Clear build cache
vercel env pull
npm run build
```

### Facebook Login Not Working
- [ ] Verify NEXTAUTH_URL matches domain
- [ ] Check META_APP_ID and META_APP_SECRET
- [ ] Verify app is in development mode on Meta
- [ ] Check redirect URIs in Meta App Settings

### Ad Accounts Not Loading
- [ ] Verify user has authorized the app
- [ ] Check access token is valid
- [ ] Check Facebook account has ad accounts
- [ ] Check API permissions in Meta

### Environment Variables Not Applied
- [ ] Wait 5 minutes for deployment to finish
- [ ] Force redeploy: `vercel --prod --force`
- [ ] Verify variables in Vercel dashboard

## Rollback

If something breaks in production:

```bash
# Find previous deployment
vercel list

# Rollback to previous
vercel rollback
```

Or in dashboard:
1. Go to Deployments
2. Find last good deployment
3. Click "..."
4. Select "Rollback to this Deployment"

## Monitoring

### Set Up Alerts

In Vercel Settings → Analytics:
- Enable Web Analytics
- Set up email alerts for failed deployments

### Monitor Logs

In Vercel Dashboard:
1. Select project
2. Click "Logs"
3. View deployment and function logs

### Error Tracking (Optional)

Consider adding error tracking:
- Sentry
- LogRocket
- Datadog

## Updating the Application

### Deploy Updates

```bash
# Make changes
git add .
git commit -m "Update: [description]"

# Push to deploy
git push origin main
```

### Database/External Services

If you add database connectivity:
1. Add database URL to environment variables
2. Run migrations in Vercel CLI
3. Deploy changes

## Security Checklist

- [ ] HTTPS is enforced
- [ ] Environment secrets are in Vercel, not in code
- [ ] No API keys in version control
- [ ] Rate limiting is configured (if applicable)
- [ ] CORS is properly configured
- [ ] Input validation is implemented
- [ ] SQL injection prevention (if applicable)
- [ ] XSS prevention implemented

## Performance Optimization

### Image Optimization
Already handled by Next.js Image component.

### Code Splitting
Already handled by Next.js App Router.

### Caching
Consider adding cache headers in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, must-revalidate"
        }
      ]
    }
  ]
}
```

## Support

**Vercel Support:** https://vercel.com/help
**Next.js Docs:** https://nextjs.org/docs
**Meta Docs:** https://developers.facebook.com/docs

---

**Version:** 1.0
**Last Updated:** 2025-11-10
