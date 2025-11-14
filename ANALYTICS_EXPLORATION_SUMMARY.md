# Poppy Ads Manager - Dashboard Analytics Exploration Summary

## 1. CURRENT DASHBOARD STRUCTURE

### Main Dashboard Page (`/app/dashboard/page.tsx`)

**Current Metrics Displayed:**
- **Active Campaigns** - Count of campaigns with ACTIVE status (linked to /dashboard/campaigns?filter=ACTIVE)
- **Paused Campaigns** - Count of campaigns with PAUSED status (linked to /dashboard/campaigns?filter=PAUSED)
- **Total Campaigns** - Total count of all campaigns (linked to campaign management)

**Data Flow:**
```
fetchAdAccounts() → GET /api/ad-accounts
    ↓
selectAccountId (with localStorage persistence)
    ↓
fetchMetrics() → GET /api/campaigns?adAccountId={selectedAccountId}
    ↓
Display metric cards + Quick Actions
```

**Quick Actions Section:**
- Link to Campaigns management page
- Link to Automated Rules page
- "Analytics" placeholder (opacity-50, marked "Coming soon")

### Current Metric Card Components:
- **MetricCardSkeleton** - Loading state for metric cards
- **Card** - Reusable card component with hover shadow effects
- **Status badges** - Green for ACTIVE, Orange for PAUSED

---

## 2. ADSSETADS & CAMPAIGNADSETS COMPONENTS

### AdSetAds Component (`/app/components/AdSetAds.tsx`)
**What it displays:**
- **Ads count** - Total number of ads in an ad set
- **Ad list** - Simple list view showing:
  - Ad name
  - Ad status (ACTIVE/PAUSED)
  - Status toggle button (Pause/Activate)

**Data structure:**
```typescript
interface Ad {
  id: string;
  name: string;
  adset_id: string;
  campaign_id: string;
  status: string;
  creative: { id, title?, body?, image_url? }
  created_time: string;
  updated_time: string;
}
```

**No performance metrics shown** - Only management/control functionality

### CampaignAdSets Component (`/app/components/CampaignAdSets.tsx`)
**What it displays:**
- **Ad Sets count** - Total number of ad sets in campaign
- **Ad Set list** with expandable sections showing:
  - Ad set name
  - Status badge (ACTIVE/PAUSED)
  - Status toggle button
  - Expandable detail section (AdSetAds component)

**Data structure:**
```typescript
interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: string;
  targeting?: Record<string, unknown>
  daily_budget?: string | number
  lifetime_budget?: string | number
  created_time: string;
  updated_time: string;
}
```

**Budget displayed on campaign list** but NOT at ad set level in the component

---

## 3. API ROUTES & DATA FETCHING

### Available API Routes:

#### `/api/ad-accounts` (GET)
- Returns list of Meta ad accounts
- **Fields fetched:** id, name, currency, account_id, account_status
- **Endpoint:** `/me/adaccounts`

#### `/api/campaigns` (GET/POST/PATCH/DELETE)
**GET:** 
- Fetches campaigns for an ad account
- **Param:** `adAccountId`
- **Fields fetched:** id, name, status, objective, created_time, updated_time, daily_budget, lifetime_budget
- **Endpoint:** `/{act_adAccountId}/campaigns`

**Fields NOT currently fetched:**
- Impressions, clicks, spend, conversion data, etc.
- Performance metrics available in Meta API but not requested

#### `/api/adsets` (GET/POST/PATCH)
**GET:**
- Fetches ad sets for a campaign
- **Param:** `campaignId`
- **Fields fetched:** id, name, campaign_id, status, targeting, daily_budget, lifetime_budget, created_time, updated_time
- **Endpoint:** `/{campaignId}/adsets`

**No performance metrics fetched**

#### `/api/ads` (GET/POST/PATCH)
**GET:**
- Fetches ads for an ad set
- **Param:** `adSetId`
- **Fields fetched:** id, name, adset_id, campaign_id, status, creative, created_time, updated_time
- **Endpoint:** `/{adSetId}/ads`

**No performance metrics fetched**

### Missing Analytics-Related Routes:
- No insights/analytics endpoint implemented
- No performance metrics endpoint
- No spend/impressions/clicks endpoint
- No conversion tracking endpoint

---

## 4. META API INTEGRATION ANALYSIS

### Current Meta API Functions (`/lib/meta-api.ts`)

**Implemented Functions:**
1. `getAdAccounts()` - Account listing
2. `getCampaigns()` - Campaign listing with basic fields
3. `getAdSets()` - Ad set listing with budget fields
4. `getAds()` - Ad listing
5. `createCampaign()`, `createAdSet()`, `createAd()` - Creation functions
6. `updateCampaignStatus()`, `updateAdSetStatus()`, `updateAdStatus()` - Status updates
7. `deleteCampaign()` - Campaign deletion
8. `getAutomatedRules()`, `createAutomatedRule()` - Rule management
9. `uploadAdImage()`, `createAdCreative()` - Creative management

**NOT Implemented - Analytics Endpoints:**

Meta Graph API provides these performance endpoints that could be used:

| Endpoint | Purpose | Example Fields |
|----------|---------|-----------------|
| `/{campaign_id}/insights` | Campaign performance | spend, impressions, clicks, reach, frequency, ctr, cpc, cpm |
| `/{adset_id}/insights` | Ad set performance | spend, impressions, clicks, conversions, roas, cpc, cpm, frequency |
| `/{ad_id}/insights` | Individual ad performance | impressions, clicks, spend, actions, action_type, action_value |
| `/{ad_account_id}/insights` | Account-level analytics | total_spend, total_impressions, total_clicks, total_actions |

**Available Meta Insights Fields:**
```
- impressions: Number of times ad was shown
- clicks: Number of clicks on ad
- spend: Amount spent (in account currency)
- reach: Number of unique people shown ad
- frequency: Average number of times shown to unique person
- actions: Conversion actions (purchases, leads, etc)
- action_values: Value of actions (e.g., purchase amount)
- ctr: Click-through rate %
- cpc: Cost per click
- cpm: Cost per thousand impressions
- date_start/date_stop: Date range for metrics
```

---

## 5. WHERE ANALYTICS WOULD FIT IN THE UI

### Current UI Structure:
```
/dashboard                 ← Main dashboard (shows overview metrics)
  ├── Campaign Overview (metric cards)
  ├── Quick Actions
  │   ├── Campaigns link
  │   ├── Automated Rules link
  │   └── Analytics (PLACEHOLDER - Coming soon)
  │
/dashboard/campaigns       ← Campaign management page
  ├── Campaign stats (Total, Active, Paused)
  ├── Search & Sort controls
  ├── Campaign list
  │   └── Expandable campaign cards
  │       └── Ad Sets (CampaignAdSets component)
  │           └── Ads (AdSetAds component)
  │
/dashboard/rules          ← Automated rules management
```

### Ideal Analytics Placement Options:

**Option 1: New Analytics Dashboard Page** (`/dashboard/analytics`)
- Account-level insights
- Campaign performance comparison
- Performance trends over time
- Top performing ads/campaigns
- Spend breakdown visualization

**Option 2: Analytics Sidebar Panel**
- Add analytics section next to Quick Actions
- Show top metrics at a glance
- Link to detailed analytics

**Option 3: Inline Analytics in Campaign/Ad Set Cards**
- Add key metrics directly to campaign cards:
  ```
  Campaign Name
  Status | Objective | Budget
  [NEW] Impressions: XXX | Clicks: XXX | Spend: $XXX
  ```
- Show in collapsible sections

**Option 4: Analytics Modal/Drawer**
- Campaign insights accessible from campaign card
- Click campaign name to see:
  - Overview metrics
  - Daily trend chart
  - Performance comparison vs other campaigns
  - Ad-level breakdown

---

## 6. DATA ALREADY BEING FETCHED

### Campaign Level:
- `id` - Campaign identifier
- `name` - Campaign name
- `status` - ACTIVE/PAUSED/ARCHIVED/DELETED
- `objective` - Campaign objective type
- `created_time` - Creation timestamp
- `updated_time` - Last update timestamp
- `daily_budget` - Daily budget limit (in cents)
- `lifetime_budget` - Lifetime budget limit (in cents)

### Ad Set Level:
- `id` - Ad set identifier
- `name` - Ad set name
- `campaign_id` - Parent campaign
- `status` - Status
- `targeting` - Targeting configuration (geo, age, interests, etc)
- `daily_budget` - Daily budget (in cents)
- `lifetime_budget` - Lifetime budget (in cents)
- `created_time` - Creation timestamp
- `updated_time` - Last update timestamp

### Ad Level:
- `id` - Ad identifier
- `name` - Ad name
- `adset_id` - Parent ad set
- `campaign_id` - Parent campaign
- `status` - Status
- `creative` - Creative reference object
- `created_time` - Creation timestamp
- `updated_time` - Last update timestamp

### NOT Being Fetched (Available in Meta API):
- **Performance metrics** - impressions, clicks, spend, reach, frequency
- **Engagement metrics** - actions, conversions, action_values
- **Cost metrics** - cpc, cpm, ctr
- **Demographic insights** - by age, gender, location
- **Device breakdowns** - mobile, desktop, tablet performance
- **Platform breakdowns** - Facebook, Instagram, Audience Network performance

---

## 7. IMPLEMENTATION RECOMMENDATIONS

### Phase 1: Foundation (Easy)
1. Create `/lib/analytics-api.ts` with functions:
   - `getCampaignInsights(campaignId, fields, dateRange)`
   - `getAdSetInsights(adSetId, fields, dateRange)`
   - `getAdInsights(adId, fields, dateRange)`

2. Create `/api/insights/campaigns` route (GET)
   - Accepts: campaignId, date_start, date_stop
   - Returns: spend, impressions, clicks, reach, frequency

3. Create `/app/components/PerformanceCard.tsx`
   - Displays: Spend, Impressions, Clicks, CTR, CPC
   - Used in campaign cards and analytics page

4. Replace "Analytics Coming Soon" button on main dashboard
   - Link to `/dashboard/analytics`

### Phase 2: Analytics Dashboard (Medium)
1. Create `/app/dashboard/analytics/page.tsx`
   - Account-level overview metrics
   - Campaign performance table with sorting/filtering
   - Date range picker for comparing periods
   - Performance charts (Chart.js or Recharts)

2. Create `/app/components/MetricsChart.tsx`
   - Displays trends over time
   - Spend, impressions, clicks line charts
   - ROAS/CPC trend visualization

3. Add analytics to campaign cards
   - Show key metrics inline
   - Add "View Analytics" button to campaign cards

### Phase 3: Advanced (Complex)
1. Performance comparison tools
   - A/B testing metrics comparison
   - Campaign vs campaign benchmarking
   - Top/bottom performers ranking

2. Forecasting & recommendations
   - Trend predictions
   - Budget optimization suggestions
   - Performance anomaly detection

3. Export/reporting
   - PDF report generation
   - Scheduled email reports
   - CSV export functionality

---

## 8. TYPESCRIPT TYPES NEEDED

```typescript
// Insights/Analytics types to add to /lib/types.ts

export interface CampaignInsights {
  campaign_id: string;
  spend: number;
  impressions: number;
  clicks: number;
  reach?: number;
  frequency?: number;
  actions?: number;
  action_values?: number;
  ctr?: number;
  cpc?: number;
  cpm?: number;
  date_start: string;
  date_stop: string;
}

export interface AdSetInsights {
  adset_id: string;
  campaign_id: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions?: number;
  roas?: number;
  cpc?: number;
  cpm?: number;
  date_start: string;
  date_stop: string;
}

export interface AdInsights {
  ad_id: string;
  adset_id: string;
  spend: number;
  impressions: number;
  clicks: number;
  actions?: number;
  action_value?: number;
  ctr?: number;
  cpc?: number;
  date_start: string;
  date_stop: string;
}

export interface AnalyticsDateRange {
  start: Date;
  end: Date;
}
```

---

## 9. SUMMARY TABLE

| Aspect | Current State | Gaps | Opportunity |
|--------|---------------|------|-------------|
| **Metrics Shown** | Campaign/Ad Set/Ad counts + Status | No performance data | Add impressions, clicks, spend |
| **API Routes** | 5 data routes (accounts, campaigns, adsets, ads, rules) | No analytics route | Add `/api/insights/*` routes |
| **Meta API Integration** | Basic CRUD operations | Insights endpoints not called | Implement `getInsights()` functions |
| **UI Components** | Management-focused cards | No metrics display components | Create `PerformanceCard`, `MetricsChart` |
| **Pages** | Dashboard, Campaigns, Rules | No analytics page | Create `/dashboard/analytics` |
| **Data Types** | Campaign, AdSet, Ad types | No insights types | Add `*Insights` interfaces |
| **Date Range Support** | None | Single-point metrics only | Add date picker for trend analysis |
| **Visualizations** | None | Text-only metrics | Add charts for trends |
| **Dashboard Placeholder** | "Analytics Coming soon" | Not functional | Replace with real analytics |

---

## 10. QUICK START FOR ANALYTICS IMPLEMENTATION

### Files to Create:
```
/lib/analytics-api.ts              - Analytics API functions
/app/api/insights/campaigns/route.ts - Campaign insights endpoint
/app/api/insights/adsets/route.ts    - Ad set insights endpoint
/app/api/insights/ads/route.ts       - Ad insights endpoint
/app/components/PerformanceCard.tsx  - Performance metrics card
/app/components/MetricsChart.tsx     - Trend chart component
/app/dashboard/analytics/page.tsx    - Analytics dashboard page
```

### Files to Modify:
```
/lib/types.ts                        - Add insights types
/app/dashboard/page.tsx              - Replace analytics placeholder
/app/components/CampaignAdSets.tsx   - Add performance metrics display
```

### Environment Variables Needed:
```
META_GRAPH_VERSION=v24.0  (already set)
META_ACCESS_TOKEN         (already available via session)
```
