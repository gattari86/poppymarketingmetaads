# Vercel Deployment Guide - Poppy Marketing Ads Manager

## ⚠️ Critical: Environment Variables Required for Production Deployment

The application will NOT work on Vercel without these environment variables set in your Vercel project dashboard.

### Required Environment Variables

#### **NextAuth Configuration** (CRITICAL)
```
NEXTAUTH_SECRET=<generate-a-secure-random-string>
NEXTAUTH_URL=https://app.poppymarketingandconsulting.com
```

**How to generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

Or use: https://generate-secret.vercel.app/32

#### **Meta App Configuration** (Required for Facebook Login)
```
META_APP_ID=<your-meta-app-id>
META_APP_SECRET=<your-meta-app-secret>
META_SYSTEM_USER_TOKEN=<your-system-user-token>
META_GRAPH_VERSION=v20.0
```

#### **Contact Information** (Optional but recommended)
```
EMAIL_SUPPORT=support@poppymarketingandconsulting.com
EMAIL_INFO=info@poppymarketingandconsulting.com
```

#### **Subapace Configuration** (Optional)
```
SUBAPACE_URL=<optional>
SUBAPACE_KEY=<optional>
```

### Setup Instructions

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `poppymarketingmetaads`
3. **Navigate to**: Settings → Environment Variables
4. **Add each variable** from the required list above
5. **Deploy** a new version to apply the variables

### Verification Checklist

- [ ] NEXTAUTH_SECRET is set (required for encryption)
- [ ] NEXTAUTH_URL matches your domain exactly
- [ ] META_APP_ID is set (Facebook Login will fail without this)
- [ ] META_APP_SECRET is set (Facebook Login will fail without this)
- [ ] All variables are applied to Production environment
- [ ] Redeploy after adding environment variables

### Troubleshooting

**Error: "There is a problem with the server configuration"**
- This means `NEXTAUTH_SECRET` is not set in Vercel
- Generate a new secret and add it to your environment variables
- Redeploy the application

**Error: Facebook Login not working**
- Verify `META_APP_ID` and `META_APP_SECRET` are correctly set
- Check that your Facebook App is properly configured
- Ensure Facebook Login is enabled for your app

**Error: Session not persisting**
- Confirm `NEXTAUTH_SECRET` is exactly the same across all deployments
- If you regenerated the secret, all existing sessions will be invalidated

## Production Deployment Checklist

✅ Environment Variables Set
✅ Build Passes Locally (`npm run build`)
✅ ESLint Passes (`npm run lint`)
✅ Pushed to GitHub main branch
✅ Vercel Webhook Triggered
✅ Application loads without errors
✅ Login flow works with Facebook
✅ Dashboard accessible after login

## Local Testing (Development)

For local development, you can create a `.env.local` file:

```
NEXTAUTH_SECRET=dev-secret-key-for-testing-only
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_DEV_MODE=true

META_APP_ID=your-app-id
META_APP_SECRET=your-app-secret
META_SYSTEM_USER_TOKEN=your-token
META_GRAPH_VERSION=v20.0

EMAIL_SUPPORT=support@poppymarketingandconsulting.com
EMAIL_INFO=info@poppymarketingandconsulting.com
```

Then run:
```bash
npm run dev
```

## Support

For deployment issues, check:
1. Vercel deployment logs: https://vercel.com/dashboard/[project-name]/deployments
2. Application runtime errors in Vercel Functions logs
3. GitHub Actions workflow status (if using)
