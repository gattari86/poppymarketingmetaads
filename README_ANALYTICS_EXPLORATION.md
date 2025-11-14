# Analytics Exploration Summary - Poppy Ads Manager

This directory contains a comprehensive analysis of the Poppy Ads Manager codebase regarding dashboard structure, metrics display, API integration, and where analytics/insights data could be added.

## Documents Included

### 1. **ANALYTICS_EXPLORATION_SUMMARY.md** (Primary Reference)
Complete technical breakdown covering:
- Current dashboard structure and metrics displayed
- AdSetAds and CampaignAdSets components analysis
- All API routes and their parameters
- Meta API integration analysis
- Where analytics would fit in the UI
- Data currently being fetched vs not being fetched
- Implementation recommendations with 3 phases
- TypeScript types needed
- Summary comparison table

**Best for:** Understanding the overall picture and implementation strategy

### 2. **ANALYTICS_ARCHITECTURE_DIAGRAM.md** (Visual Guide)
Visual representation of:
- Current architecture (what exists)
- Proposed architecture (what needs to be added)
- Data flow diagrams (current vs proposed)
- File structure after implementation
- Implementation timeline with 4 phases

**Best for:** Understanding the architecture visually and how pieces fit together

### 3. **ANALYTICS_EXPLORATION_FINAL_SUMMARY.txt** (Quick Reference)
Condensed summary in text format covering:
- All sections from ANALYTICS_EXPLORATION_SUMMARY.md
- Organized by key topics
- Implementation roadmap with file-by-file breakdown
- TypeScript types to add
- Summary comparison table

**Best for:** Quick reference and printing/sharing

## Quick Summary

### Current State
- Dashboard shows **only management metrics** (campaign counts, statuses)
- **No performance/analytics data** displayed (spend, impressions, clicks)
- Meta API insights endpoints available but **not implemented**

### Key Gaps
1. **API Routes**: No `/api/insights/*` endpoints
2. **Components**: No performance metric display components
3. **Pages**: No dedicated analytics dashboard page
4. **Types**: No insights/analytics TypeScript interfaces
5. **Visualizations**: No charts or trend graphs

### What's Available
- Meta Graph API v24.0 provides 4 insights endpoints:
  - `/{campaign_id}/insights`
  - `/{adset_id}/insights`
  - `/{ad_id}/insights`
  - `/{ad_account_id}/insights`

- Each endpoint provides 15+ metrics:
  - Spend, impressions, clicks, reach, frequency
  - CTR, CPC, CPM
  - Actions, conversions, ROAS
  - Device/platform/demographic breakdowns

## Recommended Implementation Approach

### Phase 1: Foundation (1-2 days)
1. Create `/lib/analytics-api.ts` with insight fetching functions
2. Create `/api/insights/campaigns` route (and similar for adsets/ads/account)
3. Create `PerformanceCard.tsx` component for metric display
4. Add TypeScript interfaces to `/lib/types.ts`
5. Replace "Analytics Coming Soon" button on dashboard

### Phase 2: Analytics Dashboard (1-2 days)
1. Create `/app/dashboard/analytics/page.tsx` with:
   - Account-level overview metrics
   - Campaign performance table
   - Trend charts with date range picker
2. Create `MetricsChart.tsx` component using Recharts
3. Wire up remaining insight endpoints

### Phase 3: Enhancement (1-2 days)
1. Add metrics display to campaign cards
2. Create `CampaignInsightsModal.tsx` for detailed view
3. Add export functionality (PDF, CSV)
4. Performance optimization and testing

### Phase 4: Advanced (2+ days, optional)
1. Performance comparison tools
2. Forecasting and trend prediction
3. Automated alerts on performance changes
4. Scheduled email reports

## Files That Need to Be Created

```
/lib/
  └─ analytics-api.ts                 [NEW]

/app/api/insights/
  ├─ campaigns/route.ts               [NEW]
  ├─ adsets/route.ts                  [NEW]
  ├─ ads/route.ts                     [NEW]
  └─ account/route.ts                 [NEW]

/app/components/
  ├─ PerformanceCard.tsx              [NEW]
  ├─ MetricsChart.tsx                 [NEW]
  └─ CampaignInsightsModal.tsx         [NEW]

/app/dashboard/analytics/
  └─ page.tsx                         [NEW]
```

## Files That Need Modification

```
/lib/types.ts                         [MODIFY: Add 4 interfaces]
/app/dashboard/page.tsx               [MODIFY: Replace Analytics button]
/app/components/CampaignAdSets.tsx    [MODIFY: Add metrics display]
/app/dashboard/campaigns/page.tsx     [MODIFY: Add metrics to cards]
```

## Key TypeScript Interfaces to Add

```typescript
interface CampaignInsights {
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

interface AdSetInsights {
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

interface AdInsights {
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
```

## Current Metrics Displayed

### Dashboard Level
- Active Campaigns count
- Paused Campaigns count
- Total Campaigns count

### Campaign Management Level
- Campaign stats (total, active, paused)
- Campaign details (name, status, objective, budget)
- Ad set count per campaign
- Ad count per ad set
- Ad status (ACTIVE/PAUSED)

## Data Already Being Fetched (But Not Displayed)

- Campaign: `daily_budget`, `lifetime_budget`, `created_time`, `updated_time`
- Ad Set: `targeting`, `daily_budget`, `lifetime_budget`, `created_time`, `updated_time`
- Ad: `created_time`, `updated_time`

## Performance Metrics Available in Meta API (NOT Currently Fetched)

- **Spend** - Total ad spend
- **Impressions** - Number of times ad was shown
- **Clicks** - Number of clicks on ad
- **Reach** - Number of unique people reached
- **Frequency** - Average impressions per person
- **CTR** - Click-through rate percentage
- **CPC** - Cost per click
- **CPM** - Cost per thousand impressions
- **Actions** - Conversions/actions taken
- **Action Values** - Value of conversions
- **ROAS** - Return on ad spend

## Where Analytics Would Fit

### Option 1: Dedicated Analytics Dashboard (/dashboard/analytics) - RECOMMENDED
- Account-level overview metrics
- Campaign performance comparison table
- Trend charts with date range selection
- Top performing campaigns/ads
- Export functionality

### Option 2: Inline Metrics in Campaign Cards
- Show spend, impressions, clicks directly on cards
- Display CTR, CPC inline
- "View Analytics" button for details

### Option 3: Analytics Sidebar Panel
- Summary metrics on main dashboard
- Links to detailed analytics page

### Option 4: Campaign Details Modal
- Click campaign to see detailed metrics
- Daily trend chart
- Ad set performance breakdown

**Recommended:** Combination of all options for comprehensive analytics experience

## Environment Variables

The following are already configured:
- `META_GRAPH_VERSION=v24.0` - Meta API version
- Session-based access token - Available via `nextAuth` session

No additional environment variables needed for analytics implementation.

## Dependencies to Consider

For visualization (optional but recommended):
- **Recharts** - React charting library (lightweight, good for dashboards)
- **Chart.js** - Alternative charting library
- **date-fns** - Date manipulation utilities

Current project uses:
- Next.js
- React
- TypeScript
- Tailwind CSS
- NextAuth for authentication

## Testing the Implementation

1. **Unit Tests**: Test analytics-api functions with mock data
2. **Integration Tests**: Test API routes with mock Meta API responses
3. **Component Tests**: Test PerformanceCard and MetricsChart display
4. **E2E Tests**: Test full user flow from dashboard to analytics

## Common Pitfalls to Avoid

1. **Date Range Handling**: Meta API insights require `date_start` and `date_stop` in `YYYY-MM-DD` format
2. **Insights Latency**: Meta insights data may have 24-48 hour delay
3. **Rate Limiting**: Monitor API rate limits when fetching multiple campaigns
4. **Data Aggregation**: Account-level insights require summing campaign metrics
5. **Timezone Handling**: Meta API returns UTC; may need timezone conversion for display

## Performance Considerations

1. **Caching**: Consider caching insights data (1-3 hours) to reduce API calls
2. **Pagination**: When displaying campaigns, implement pagination before fetching all insights
3. **Lazy Loading**: Load analytics only when user navigates to analytics page
4. **Parallel Requests**: Use Promise.all() for fetching multiple campaign insights
5. **Date Range Defaults**: Default to "last 30 days" to limit data volume

## Next Steps

1. Review this documentation thoroughly
2. Read the detailed summary documents in order
3. Start with Phase 1 implementation
4. Use the architecture diagram as reference during coding
5. Follow the implementation timeline for scope management

---

**Last Updated:** November 12, 2025
**Status:** Analysis Complete - Ready for Implementation
**Author:** Analytics Exploration Summary

For detailed implementation guidance, see `ANALYTICS_EXPLORATION_SUMMARY.md`
For visual architecture reference, see `ANALYTICS_ARCHITECTURE_DIAGRAM.md`
For quick implementation checklist, see `ANALYTICS_EXPLORATION_FINAL_SUMMARY.txt`
