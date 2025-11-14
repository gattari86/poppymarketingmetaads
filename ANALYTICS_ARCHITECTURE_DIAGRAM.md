# Poppy Ads Manager - Analytics Architecture Diagram

## Current Architecture (What Exists)

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND COMPONENTS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Dashboard Page (/dashboard/page.tsx)                            │
│  ├─ Metric Cards: Active, Paused, Total Campaigns              │
│  ├─ Quick Actions: Campaigns, Rules, Analytics (PLACEHOLDER)   │
│  └─ Data: Campaign counts only, no performance data            │
│                                                                   │
│  Campaigns Page (/dashboard/campaigns/page.tsx)                 │
│  ├─ Campaign Stats: Total, Active, Paused                      │
│  ├─ Campaign List (expandable)                                 │
│  └─ CampaignAdSets Component                                   │
│      └─ AdSetAds Component                                     │
│          └─ Ad Items (name, status only)                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     API ROUTES (Backend)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  GET  /api/ad-accounts           → List Meta ad accounts        │
│  GET  /api/campaigns?adAccountId → List campaigns               │
│  GET  /api/adsets?campaignId     → List ad sets                 │
│  GET  /api/ads?adSetId           → List ads                    │
│  GET  /api/rules?adAccountId     → List automated rules        │
│                                                                   │
│  POST   /api/campaigns           → Create campaign             │
│  PATCH  /api/campaigns           → Update campaign status      │
│  DELETE /api/campaigns           → Delete campaign             │
│  (Similar for adsets, ads, rules)                              │
│                                                                   │
│  *** NO ANALYTICS ROUTES YET ***                               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    META GRAPH API (v24.0)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Called Endpoints:                                               │
│  • /me/adaccounts                                               │
│  • /{act_adAccountId}/campaigns       Fields: id, name,         │
│  • /{campaignId}/adsets               status, objective,        │
│  • /{adSetId}/ads                     created_time,             │
│  • /{adAccountId}/adrules_library     daily_budget,             │
│                                        lifetime_budget           │
│                                                                   │
│  AVAILABLE BUT NOT CALLED (INSIGHTS):                           │
│  • /{campaign_id}/insights            Fields: spend,            │
│  • /{adset_id}/insights               impressions,              │
│  • /{ad_id}/insights                  clicks, reach,            │
│  • /{ad_account_id}/insights          frequency, ctr,           │
│                                        cpc, cpm, actions,        │
│                                        action_values, etc        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Proposed Architecture (What Needs to be Added)

```
┌──────────────────────────────────────────────────────────────────┐
│                   ENHANCED FRONTEND COMPONENTS                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Dashboard Page (Updated)                                        │
│  ├─ Metric Cards: Active, Paused, Total Campaigns              │
│  ├─ Quick Actions: Campaigns, Rules, Analytics → /analytics    │
│  └─ Data: Campaign counts + overview metrics                   │
│                                                                   │
│  [NEW] Analytics Dashboard (/dashboard/analytics/page.tsx)      │
│  ├─ Account-Level Metrics:                                     │
│  │  ├─ Total Spend                                             │
│  │  ├─ Total Impressions                                       │
│  │  ├─ Total Clicks                                            │
│  │  └─ Aggregate CTR / CPC / CPM                               │
│  │                                                              │
│  ├─ Campaign Performance Table:                                │
│  │  ├─ Campaign Name | Status | Budget | Spend | ROI         │
│  │  ├─ Impressions | Clicks | CTR | CPC                       │
│  │  └─ Sort / Filter / Export functionality                   │
│  │                                                              │
│  ├─ Trend Charts:                                              │
│  │  ├─ Daily Spend Trend (Line Chart)                         │
│  │  ├─ Daily Impressions/Clicks (Line Chart)                  │
│  │  └─ Date Range Picker (Last 7/30/90 days)                 │
│  │                                                              │
│  └─ Top Performers:                                            │
│     ├─ Best ROI Campaigns                                     │
│     ├─ Highest Spend Campaigns                                │
│     └─ Highest CTR Ads                                        │
│                                                                   │
│  Campaigns Page (Enhanced)                                      │
│  └─ Campaign Cards Now Show:                                   │
│     ├─ [EXISTING] Name, Status, Objective, Budget             │
│     ├─ [NEW] Spend, Impressions, Clicks                       │
│     ├─ [NEW] CTR, CPC, ROAS                                   │
│     └─ [NEW] "View Analytics" Button → Details Modal           │
│                                                                   │
│  [NEW] PerformanceCard Component                               │
│  ├─ Displays key metrics in card format:                      │
│  │  ├─ Spend: $X.XX                                           │
│  │  ├─ Impressions: X,XXX                                     │
│  │  ├─ Clicks: XXX                                            │
│  │  ├─ CTR: X.XX%                                             │
│  │  └─ CPC: $X.XX                                             │
│  └─ Used in dashboard, campaigns, analytics pages             │
│                                                                   │
│  [NEW] MetricsChart Component                                  │
│  ├─ Line Chart for trends over time                           │
│  ├─ Multiple series: Spend, Impressions, Clicks               │
│  ├─ Date range picker integration                             │
│  └─ Responsive Recharts/Chart.js visualization               │
│                                                                   │
│  [NEW] CampaignInsights Modal                                  │
│  ├─ Detailed view when clicking campaign                      │
│  ├─ Overview metrics                                          │
│  ├─ Daily trend for selected date range                       │
│  ├─ Ad Set performance breakdown                              │
│  └─ Export as PDF / CSV                                       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                   ENHANCED API ROUTES (Backend)                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  EXISTING ROUTES (No change):                                    │
│  GET  /api/ad-accounts                                          │
│  GET  /api/campaigns?adAccountId                                │
│  GET  /api/adsets?campaignId                                    │
│  GET  /api/ads?adSetId                                          │
│  GET  /api/rules?adAccountId                                    │
│  (and POST/PATCH/DELETE variants)                               │
│                                                                   │
│  [NEW] ANALYTICS ROUTES:                                        │
│  ┌─ Campaign Insights                                           │
│  │  GET /api/insights/campaigns                                │
│  │  Params: campaignId, date_start?, date_stop?              │
│  │  Returns: {                                                 │
│  │    campaign_id, spend, impressions, clicks,                │
│  │    reach, frequency, actions, ctr, cpc, cpm,              │
│  │    date_start, date_stop                                   │
│  │  }                                                          │
│  │                                                              │
│  ├─ Ad Set Insights                                            │
│  │  GET /api/insights/adsets                                  │
│  │  Params: adsetId, date_start?, date_stop?                │
│  │  Returns: Same structure as campaign                       │
│  │                                                              │
│  ├─ Ad Insights                                                │
│  │  GET /api/insights/ads                                     │
│  │  Params: adId, date_start?, date_stop?                   │
│  │  Returns: Same structure as campaign                       │
│  │                                                              │
│  └─ Account-Level Analytics                                    │
│     GET /api/insights/account                                 │
│     Params: adAccountId, date_start?, date_stop?             │
│     Returns: Aggregated metrics for entire account             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                   META GRAPH API (v24.0)                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  EXISTING CALLS (No change):                                     │
│  • /me/adaccounts                                               │
│  • /{act_adAccountId}/campaigns                                 │
│  • /{campaignId}/adsets                                         │
│  • /{adSetId}/ads                                               │
│  • /{adAccountId}/adrules_library                               │
│                                                                   │
│  [NEW] INSIGHTS CALLS (via new analytics-api.ts):               │
│  ┌─ /meta-api.ts → analytics-api.ts Bridge                     │
│  │  getCampaignInsights(campaignId, dateRange)                │
│  │  getAdSetInsights(adsetId, dateRange)                      │
│  │  getAdInsights(adId, dateRange)                            │
│  │  getAccountInsights(accountId, dateRange)                  │
│  │                                                              │
│  └─ Each function calls Meta API with:                         │
│     • /{id}/insights?fields=spend,impressions,clicks,...      │
│     • time_range={date_start, date_stop}                      │
│     • Optionally: breakdown_by [time, device, platform]       │
│                                                                   │
│  Meta Insights Endpoints:                                        │
│  • GET /{campaign_id}/insights                                 │
│  • GET /{adset_id}/insights                                    │
│  • GET /{ad_id}/insights                                       │
│  • GET /{ad_account_id}/insights                               │
│                                                                   │
│  Available Metrics:                                              │
│  impressions, clicks, spend, reach, frequency, actions,        │
│  action_type, action_value, ctr, cpc, cpm, date_start,       │
│  date_stop, action_values                                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Current Flow (Simple)
```
User Visits Dashboard
        ↓
fetchAdAccounts() - GET /api/ad-accounts
        ↓
selectAccountId
        ↓
fetchCampaigns() - GET /api/campaigns?adAccountId=X
        ↓
Display: Active Count | Paused Count | Total Count
        ↓
User Clicks Campaign
        ↓
Fetch Ad Sets - GET /api/adsets?campaignId=Y
        ↓
Display: Ad Set list (expandable)
        ↓
User Expands Ad Set
        ↓
Fetch Ads - GET /api/ads?adSetId=Z
        ↓
Display: Ad list with status toggles
```

### Proposed Analytics Flow
```
User Clicks "Analytics" Button
        ↓
/dashboard/analytics page loads
        ↓
fetchAccountInsights() - GET /api/insights/account?adAccountId=X
    ↓
    getAccountInsights(X, defaultDateRange)
        ↓
        getCampaignInsights(campaignId, dateRange) for each campaign
            ↓
            Meta API: GET /{campaignId}/insights?fields=spend,impressions,...
        ↓
Display Metrics Cards:
├─ Total Spend: $X,XXX
├─ Total Impressions: X,XXX,XXX
├─ Total Clicks: X,XXX
├─ Aggregate CTR: X.XX%
└─ Aggregate CPC: $X.XX

Display Campaign Performance Table
├─ Sortable columns: Campaign, Spend, Impressions, Clicks, CTR
└─ Clickable rows → CampaignInsights modal

Display Trend Charts
├─ Date Range Picker (Last 7/30/90 days)
└─ Line Chart showing daily spend + impressions

User Changes Date Range
        ↓
Refetch insights with new date_start/date_stop
        ↓
Update all charts and metrics

User Clicks Campaign Row
        ↓
fetchCampaignInsights(campaignId, dateRange)
        ↓
Display Modal:
├─ Campaign Name + Overview Metrics
├─ Daily Trend Chart for this campaign
├─ Ad Set Performance Breakdown
│   ├─ Ad Set Name | Spend | Impressions | Clicks
│   └─ Clickable to see Ad-level breakdown
├─ Performance Alerts (e.g., "CTR dropped 20%")
└─ Export Buttons (PDF, CSV)
```

---

## File Structure After Implementation

```
poppy-ads-manager/
├── app/
│   ├── components/
│   │   ├── AdSetAds.tsx                  (existing, unchanged)
│   │   ├── CampaignAdSets.tsx            (existing, ADD metrics display)
│   │   ├── PerformanceCard.tsx           [NEW] Performance metrics card
│   │   ├── MetricsChart.tsx              [NEW] Trend chart visualization
│   │   └── CampaignInsightsModal.tsx     [NEW] Campaign details modal
│   │
│   ├── api/
│   │   ├── campaigns/route.ts            (existing, unchanged)
│   │   ├── adsets/route.ts               (existing, unchanged)
│   │   ├── ads/route.ts                  (existing, unchanged)
│   │   └── insights/
│   │       ├── campaigns/route.ts        [NEW] Campaign insights endpoint
│   │       ├── adsets/route.ts           [NEW] Ad set insights endpoint
│   │       ├── ads/route.ts              [NEW] Ad insights endpoint
│   │       └── account/route.ts          [NEW] Account insights endpoint
│   │
│   ├── dashboard/
│   │   ├── page.tsx                      (existing, MODIFY: link Analytics button)
│   │   ├── campaigns/page.tsx            (existing, MODIFY: add metrics display)
│   │   ├── rules/page.tsx                (existing, unchanged)
│   │   └── analytics/
│   │       └── page.tsx                  [NEW] Analytics dashboard page
│   │
│   └── ...
│
├── lib/
│   ├── meta-api.ts                       (existing, unchanged)
│   ├── analytics-api.ts                  [NEW] Analytics API functions
│   │   ├── getCampaignInsights()
│   │   ├── getAdSetInsights()
│   │   ├── getAdInsights()
│   │   └── getAccountInsights()
│   │
│   ├── types.ts                          (existing, ADD insights types)
│   │   ├── CampaignInsights interface
│   │   ├── AdSetInsights interface
│   │   ├── AdInsights interface
│   │   └── AnalyticsDateRange interface
│   │
│   └── utils.ts                          (existing, maybe ADD date utilities)
│
└── ...
```

---

## Implementation Timeline

### Phase 1: Foundation (1-2 days)
- [x] Create `/lib/analytics-api.ts` with 4 functions
- [x] Create `/app/api/insights/campaigns/route.ts`
- [x] Create `/app/components/PerformanceCard.tsx`
- [x] Add insights types to `/lib/types.ts`
- [x] Update dashboard button → links to `/dashboard/analytics`

### Phase 2: Dashboard (1-2 days)
- [ ] Create `/app/dashboard/analytics/page.tsx`
- [ ] Create `/app/components/MetricsChart.tsx` (with Recharts)
- [ ] Add date range picker
- [ ] Build campaign performance table
- [ ] Wire up ad set/ad insights endpoints

### Phase 3: Enhancement (1-2 days)
- [ ] Add metrics display to campaign cards
- [ ] Create `CampaignInsightsModal.tsx`
- [ ] Add export functionality
- [ ] Performance optimizations
- [ ] Testing and bug fixes

### Phase 4: Advanced (2+ days, optional)
- [ ] Comparison tools
- [ ] Forecasting
- [ ] Automated alerts
- [ ] Scheduled reports

