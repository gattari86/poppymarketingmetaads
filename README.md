# Poppy Marketing Ads Manager

A clean, minimal, and attractive dashboard application for managing Meta advertising campaigns, ad sets, and ads. Built with Next.js, TypeScript, and Tailwind CSS.

**Live Demo:** https://app.poppymarketingandconsulting.com

## Features

✨ **Core Features**
- Facebook Login for Business authentication
- View and manage multiple ad accounts
- Create and manage campaigns
- Create and manage ad sets
- Create and manage ads
- Automated rules for cost control
- Beautiful, responsive UI with Bento box design

🔒 **Security & Privacy**
- Server-side API calls (no tokens in frontend)
- NextAuth.js for secure authentication
- GDPR/CCPA compliant data handling
- Data deletion requests
- Privacy policy and terms of service

📱 **Design**
- Pastel color palette (Poppins brand colors)
- Soft rounded cards and shadows
- Generous whitespace and clean typography
- Mobile responsive
- Professional footer with legal links

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Auth:** NextAuth.js with Facebook Login
- **API:** Meta Graph API v20.0
- **Deployment:** Vercel
- **State Management:** Subapace (optional)

## Color Palette

```
Primary: #736CED (Poppy Dark Purple)
Secondary: #9F9FED (Poppy Purple)
Light: #D4C1EC (Poppy Light Purple)
Cream: #F2DFD7 (Poppy Cream)
Off-White: #FEF9FF (Poppy White)
```

## Project Structure

```
poppy-ads-manager/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth configuration
│   │   ├── ad-accounts/           # Ad accounts API
│   │   ├── campaigns/             # Campaigns API
│   │   ├── adsets/                # Ad sets API
│   │   ├── ads/                   # Ads API
│   │   ├── rules/                 # Automated rules API
│   │   ├── support/               # Support form API
│   │   └── data-deletion/         # Data deletion API
│   ├── dashboard/
│   │   ├── layout.tsx             # Dashboard layout
│   │   ├── page.tsx               # Dashboard home
│   │   ├── campaigns/             # Campaigns page
│   │   └── rules/                 # Rules page
│   ├── auth/
│   │   ├── signin/                # Sign in page
│   │   └── error/                 # Auth error page
│   ├── privacy-policy/            # Privacy policy
│   ├── terms/                     # Terms of service
│   ├── data-deletion/             # Data deletion page
│   ├── support/                   # Support page
│   ├── components/                # Reusable components
│   ├── globals.css                # Global styles
│   └── layout.tsx                 # Root layout
├── lib/
│   ├── auth.ts                    # NextAuth config
│   ├── types.ts                   # TypeScript types
│   └── meta-api.ts                # Meta API functions
├── public/                        # Static assets
├── docs/                          # Documentation
├── .env.example                   # Environment template
├── DEPLOYMENT.md                  # Deployment guide
├── next.config.ts                 # Next.js config
├── tailwind.config.ts             # Tailwind config
└── tsconfig.json                  # TypeScript config
```

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/gattari86/poppymarketingmetaads.git
cd poppy-ads-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Fill in the following:
```
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_SYSTEM_USER_TOKEN=optional_dev_bypass
META_GRAPH_VERSION=v20.0
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=http://localhost:3000
EMAIL_SUPPORT=support@poppymarketingandconsulting.com
EMAIL_INFO=info@poppymarketingandconsulting.com
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and sign in with Facebook.

### 5. Build for Production

```bash
npm run build
npm start
```

## Meta App Setup

### Prerequisites

- Meta Business Account
- Business Verification (completed)
- Tech Provider Verification (completed)

### Create Meta App

1. Go to https://developers.facebook.com/
2. Create a new app → Business
3. Add "Meta Business Platform" product
4. Get App ID and App Secret
5. Add app domain: `app.poppymarketingandconsulting.com`
6. Set OAuth Redirect URL: `https://app.poppymarketingandconsulting.com/api/auth/callback/facebook`

### Request Permissions

Request Standard Access for:
- `ads_management` - Create and manage ads
- `business_management` - Access ad accounts
- `pages_show_list` - List business pages
- `pages_read_engagement` - Read page engagement metrics

See `docs/permissions-justification.md` for detailed justification.

## Deployment

### To Vercel

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys from main branch
# Or manually deploy:
npm install -g vercel
vercel
```

See `DEPLOYMENT.md` for detailed instructions.

### Environment Variables on Vercel

In Vercel Project Settings → Environment Variables:
1. Add all variables from `.env.example`
2. Mark as Production environment only
3. Deploy

## Documentation

- **[Deployment Guide](./DEPLOYMENT.md)** - How to deploy to Vercel
- **[Review Checklist](./docs/review-checklist.md)** - Meta App Review steps
- **[Permissions Justification](./docs/permissions-justification.md)** - Why each scope is needed
- **[Data Deletion Procedure](./docs/data-deletion-procedure.md)** - How user data is deleted
- **[Screencast Script](./docs/screencast-script.md)** - Script for recording demo

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with Facebook
- `GET /api/auth/session` - Get current session

### Ad Accounts
- `GET /api/ad-accounts` - List user's ad accounts

### Campaigns
- `GET /api/campaigns?adAccountId=[id]` - List campaigns
- `POST /api/campaigns?adAccountId=[id]` - Create campaign

### Ad Sets
- `GET /api/adsets?campaignId=[id]` - List ad sets
- `POST /api/adsets?campaignId=[id]` - Create ad set

### Ads
- `GET /api/ads?adSetId=[id]` - List ads
- `POST /api/ads?adSetId=[id]` - Create ad

### Automated Rules
- `POST /api/rules?adAccountId=[id]` - Create automated rule

### Support & Data
- `POST /api/support` - Submit support request
- `POST /api/data-deletion` - Request data deletion

## Pages

### Public Pages
- `/` - Home (redirects to login)
- `/auth/signin` - Login page
- `/auth/error` - Authentication error page
- `/privacy-policy` - Privacy policy
- `/terms` - Terms of service
- `/data-deletion` - Data deletion request
- `/support` - Support form

### Dashboard Pages
- `/dashboard` - Home with account selection
- `/dashboard/campaigns` - Manage campaigns
- `/dashboard/rules` - Create automated rules

## Component Hierarchy

```
RootLayout
├── Page (home redirect)
├── Auth
│   ├── SignIn
│   └── Error
├── Dashboard Layout
│   ├── Dashboard Home
│   ├── Campaigns Page
│   │   ├── CreateCampaignModal
│   │   └── CampaignAdSets
│   │       ├── CreateAdSetModal
│   │       └── AdSetAds
│   │           └── CreateAdModal
│   ├── Rules Page
│   │   └── CreateRuleModal
│   ├── Privacy Policy
│   ├── Terms
│   ├── Data Deletion
│   └── Support
```

## State Management

### Client-Side State
- Session state (NextAuth)
- UI state (React hooks)
- Account selection (localStorage)

### No Sensitive Data Stored Client-Side
- Access tokens are server-only
- API calls are routed through server
- User preferences stored in localStorage (non-sensitive)

### Optional: Subapace Integration

For storing user preferences without a database:

```typescript
// In your component
import { useSubapace } from '@/lib/subapace'

const { data, setData } = useSubapace('user-preferences')
```

## Security

✅ **Implemented**
- HTTPS only
- Server-side API calls
- NextAuth session management
- Environment variable isolation
- Input validation
- Error handling

🔒 **Data Protection**
- No tokens in localStorage
- Sessions expire after 30 days
- GDPR/CCPA compliance
- Data deletion support
- Privacy policy and terms

## Troubleshooting

### "Facebook login not working"
- Check NEXTAUTH_URL matches domain
- Verify META_APP_ID and META_APP_SECRET
- Check redirect URL in Meta App Settings

### "Ad accounts not loading"
- Verify user authorized the app
- Check account has ads_management access
- Confirm Meta account has ad accounts

### "Deployment failed"
- Check all environment variables are set
- Verify domain is configured
- Check build logs: `npm run build`

## Development

### Start Dev Server
```bash
npm run dev
```

### Run Type Checking
```bash
npx tsc --noEmit
```

### Format Code
```bash
npx prettier --write .
```

### Build for Production
```bash
npm run build
npm start
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Support

- **Email:** support@poppymarketingandconsulting.com
- **Support Form:** https://app.poppymarketingandconsulting.com/support
- **Data Deletion:** https://app.poppymarketingandconsulting.com/data-deletion

## License

© 2025 Poppy Marketing & Consulting. All rights reserved.

## Changelog

### v1.0.0 (2025-11-10)
- Initial release
- Facebook Login for Business
- Campaign management
- Ad set management
- Ad management
- Automated rules
- Public pages and documentation

---

**Made with ❤️ by Poppy Marketing & Consulting**

**Live:** https://app.poppymarketingandconsulting.com
**GitHub:** https://github.com/gattari86/poppymarketingmetaads
