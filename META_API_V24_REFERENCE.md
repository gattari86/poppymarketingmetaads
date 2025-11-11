# Meta Marketing API v24.0 - Implementation Guide
## Poppy Ads Manager Reference

This document outlines the Meta Marketing API v24.0 parameters used in the Poppy Ads Manager application, based on the official Meta documentation. It serves as a quick reference for understanding Campaign, Ad Set, and Ad objects and their relationships.

---

## Table of Contents
1. [Campaign (Ad Campaign)](#campaign-ad-campaign)
2. [Ad Set](#ad-set)
3. [Ad (Ad Creative Delivery)](#ad-ad-creative-delivery)
4. [Budget Models](#budget-models)
5. [Key Constraints & Best Practices](#key-constraints--best-practices)

---

## Campaign (Ad Campaign)

**What it is:** The top-level object that defines an advertising objective and groups ad sets. Every ad campaign requires a campaign object.

### Current Implementation in Poppy Ads Manager

**Fields we support:**
- `name` (required): Campaign name, up to 255-400 characters
- `objective` (required): Campaign advertising objective (OUTCOME_SALES, OUTCOME_LEADS, OUTCOME_TRAFFIC, etc. in ODAX v24)
- `status` (optional): Set to PAUSED on creation to prevent delivery until configuration is complete
- `daily_budget` (optional): Daily spend cap in cents (e.g., 500 = $5.00)
- `special_ad_categories` (optional): List of special categories if campaign is for HOUSING, EMPLOYMENT, CREDIT, or ISSUES_ELECTIONS_POLITICS

**Fields we don't currently support (but could be added):**
- `lifetime_budget`: Total spend cap for campaign lifetime
- `spend_cap`: Optional lifetime spend limit across all ad sets
- `bid_strategy`: How budget is allocated across ad sets (LOWEST_COST_WITHOUT_CAP, COST_CAP, etc.)
- `is_adset_budget_sharing_enabled`: Flag indicating ad set-level budgets

**Key Relationship:**
```
Campaign (budget, objective, targeting rules)
  └── Ad Set 1 (inherits objective, may have own targeting)
       └── Ad 1 (creative)
       └── Ad 2 (different creative, same targeting)
  └── Ad Set 2 (different targeting)
       └── Ad 3 (creative)
```

**Important:** When `is_adset_budget_sharing_enabled = false` (our current model), the campaign has one shared budget and ad sets inherit it. Ad sets should NOT have their own budgets.

---

## Ad Set

**What it is:** Defines the targeting, budget allocation, bidding, and schedule for a group of ads under a campaign.

### Current Implementation in Poppy Ads Manager

**Fields we support:**
- `name` (required): Ad set name, up to 400 characters
- `campaign_id` (required): Parent campaign ID
- `status` (optional): ACTIVE or PAUSED (set to PAUSED on creation)
- `optimization_goal` (required): What to optimize for (REACH, IMPRESSIONS, LINK_CLICKS, VIDEO_VIEWS, LANDING_PAGE_VIEWS, POST_ENGAGEMENT, etc.)
- `billing_event` (required): How to charge (IMPRESSIONS, LINK_CLICKS, VIDEO_VIEWS, THRUPLAY, etc.)
- `bid_amount` (optional): Maximum bid per event in cents (e.g., 200 = $2.00)
- `targeting` (required): JSON object with targeting criteria:
  - `geo_locations`: Object with `countries` array (e.g., `["US", "CA"]`)
  - `age_min`: Minimum age (13, 18, 21, 25, etc.)
  - `age_max`: Maximum age (65, 120, etc.)

**Fields we don't currently support (but could be added):**
- `daily_budget` or `lifetime_budget`: Ad set-level budgets (NOT supported with campaign budget)
- `start_time` / `end_time`: Schedule ad set delivery
- `pacing_type`: STANDARD (default) or ACCELERATED spending
- `attribution_setting`: Conversion attribution window (e.g., "7d_click_1d_view")
- `promoted_object`: Required for certain objectives (conversions, app installs, etc.)
- `destination_type`: WEBSITE, APP, MESSENGER, WHATSAPP, FACEBOOK

### Targeting Structure (JSON)
```json
{
  "geo_locations": {
    "countries": ["US", "CA", "MX"]
  },
  "age_min": 18,
  "age_max": 65
}
```

**Note:** The targeting object is stored as JSON and sent to Meta API exactly as provided. Additional targeting options (interests, behaviors, custom audiences, etc.) should be configured in Meta Ads Manager.

---

## Ad (Ad Creative Delivery)

**What it is:** An individual creative instance being served, linked to an ad set. Ads specify the creative material being used.

### Current Implementation in Poppy Ads Manager

**Fields we support:**
- `name` (optional): Ad name for reference (not shown to users)
- `adset_id` (required): Parent ad set ID
- `status` (optional): ACTIVE or PAUSED
- `creative` (required): Object containing `creative_id` of existing Ad Creative

**Note on Creatives:** Creatives must be created in Meta Ads Manager first. The `creative_id` is then referenced when creating an ad. A creative contains:
- Image or video
- Headline
- Body text
- Call-to-action button
- Landing page URL or destination

**Fields we don't currently support:**
- `tracking_specs`: Custom conversion tracking (usually handled at ad set level)
- `conversion_domain`: Domain for iOS14+ conversion tracking

### Creative Creation Workflow
```
1. User logs into Meta Ads Manager
2. Creates or selects an Ad Creative (with image, text, CTA, link)
3. Gets the creative_id from Meta
4. Returns to Poppy Ads Manager
5. Pastes creative_id when creating Ad
6. Poppy posts to /api/ads with creative: { "creative_id": "..." }
```

---

## Budget Models

### Model A: Campaign-Level Budget (Current Implementation)
```
Campaign
├── daily_budget: $100/day
├── Ad Set 1 (no budget, inherits $100 allocation)
│   └── Ad 1
│   └── Ad 2
└── Ad Set 2 (no budget, inherits $100 allocation)
    └── Ad 3
```

**Rules:**
- `campaign.is_adset_budget_sharing_enabled = false` (or omitted)
- `campaign.daily_budget` is set
- `adset.daily_budget` is NOT set
- Meta distributes campaign budget across all ad sets based on performance

### Model B: Ad Set-Level Budget (Future Option)
```
Campaign
├── is_adset_budget_sharing_enabled: true
├── Ad Set 1
│   ├── daily_budget: $50/day
│   └── Ad 1
└── Ad Set 2
    ├── daily_budget: $50/day
    └── Ad 2
```

**Rules:**
- `campaign.is_adset_budget_sharing_enabled = true`
- `campaign.daily_budget` is NOT set
- Each `adset.daily_budget` is set individually
- Each ad set has its own fixed budget

**⚠️ CRITICAL:** You cannot use both budget models simultaneously. Pick one per campaign.

**Poppy's Current Choice:** Campaign-level budgets (Model A) because:
1. Simpler for users (one budget setting at campaign level)
2. Meta's algorithm distributes automatically based on performance
3. Less configuration complexity

---

## Key Constraints & Best Practices

### 1. Budget & Ad Set Relationship
```
❌ INVALID: Campaign has budget + Ad Set also has budget
✅ VALID: Campaign has budget, Ad Sets have no budget
✅ VALID: Campaign has no budget, each Ad Set has budget
```

**Error Message if Violated:**
```
"You can only set an ad set budget or a campaign budget."
```

### 2. Optimization Goal & Billing Event
- Must be compatible pairs
- Usually auto-determined, but should be explicitly set:
  - REACH objective → IMPRESSIONS billing
  - LINK_CLICKS objective → LINK_CLICKS billing
  - VIDEO_VIEWS objective → VIDEO_VIEWS or THRUPLAY billing

### 3. Required Fields by Objective

| Objective | Required at Ad Set Level | Example |
|-----------|--------------------------|---------|
| REACH / TRAFFIC | targeting, optimization_goal, billing_event | Basic targeting + clicks |
| CONVERSIONS | promoted_object with pixel_id & event | Pixel ID + PURCHASE event |
| APP_INSTALLS | promoted_object with application_id | App ID |
| LEAD_GENERATION | promoted_object with page_id | Facebook Page ID |

**Note:** Poppy currently supports REACH/TRAFFIC objectives best. Conversions require pixel setup.

### 4. Status Inheritance
```
Campaign PAUSED
  └── Ad Set ACTIVE
      └── Ad ACTIVE
         → Effective Status: CAMPAIGN_PAUSED (won't deliver)

Campaign ACTIVE
  └── Ad Set PAUSED
      └── Ad ACTIVE
         → Effective Status: ADSET_PAUSED (won't deliver)

Campaign ACTIVE
  └── Ad Set ACTIVE
      └── Ad PAUSED
         → Effective Status: PAUSED (won't deliver)
```

**Implication:** Pause at the highest level (campaign or ad set) to stop delivery. All children inherit the pause status.

### 5. Special Ad Categories
If promoting HOUSING, EMPLOYMENT, CREDIT, or ISSUES_ELECTIONS_POLITICS ads:
1. Set `special_ad_categories = ["HOUSING"]` (or appropriate category)
2. Set `special_ad_category_country = ["US"]` (or relevant countries)
3. Targeting options will be restricted (certain demographics/interests unavailable)

### 6. Age Targeting Range
- Minimum age: 13, 18, 21, 25, 30, 35, 40, 45, 50, 55, 60, 65
- Maximum age: 17, 21, 25, 30, 35, 40, 45, 50, 55, 60, 65, 120
- 120 = "65+" (unlimited upper bound)

### 7. Currency & Amount Fields
All monetary fields in Meta API use **minor currency units** (cents):
- `1000` = $10.00 USD
- `5000` = $50.00 USD
- `200` = $2.00 USD

**Conversion:** User inputs dollars → Multiply by 100 to get cents for API

### 8. Targeting Structure
```json
{
  "geo_locations": {
    "countries": ["US", "CA"]  // Array of ISO country codes
  },
  "age_min": 18,
  "age_max": 65,
  // Optional (not in Poppy's current form):
  "genders": [1, 2],  // 1=male, 2=female
  "flexible_spec": [
    { "interests": [{"id": "6003107", "name": "Technology"}] }
  ],
  "custom_audiences": [{"id": "123456"}]
}
```

**Poppy's Current Implementation:** Only supports `geo_locations`, `age_min`, `age_max`. User can add more in Meta Ads Manager.

### 9. Effective Status Values
Common effective_status values returned by API:
- `ACTIVE`: Running and delivering
- `PAUSED`: Intentionally paused
- `CAMPAIGN_PAUSED`: Parent campaign is paused
- `ADSET_PAUSED`: Parent ad set is paused
- `ARCHIVED`: Archived (no longer active)
- `DELETED`: Deleted (unrecoverable)
- `IN_PROCESS`: Still being set up
- `WITH_ISSUES`: Has configuration issues

---

## Implementation Checklist for Future Enhancements

- [ ] Lifetime budgets (with end_time)
- [ ] Spend caps (daily_spend_cap, lifetime_spend_cap)
- [ ] Bid strategies (COST_CAP, LOWEST_COST_WITH_MIN_ROAS)
- [ ] Advanced targeting (interests, behaviors, custom audiences)
- [ ] Conversion tracking (promoted_object with pixel_id)
- [ ] Ad scheduling (start_time, end_time)
- [ ] Dynamic creative (multiple image/text combinations)
- [ ] Attribution settings (custom conversion windows)
- [ ] Placement exclusions (soft opt-out)
- [ ] A/B testing (split testing across ad sets)

---

## References

- Meta Marketing API v24.0 Official Docs: https://developers.facebook.com/docs/marketing-api/reference/
- Campaign Object: https://developers.facebook.com/docs/marketing-api/reference/ad-campaign
- Ad Set Object: https://developers.facebook.com/docs/marketing-api/reference/ad-set
- Ad Object: https://developers.facebook.com/docs/marketing-api/reference/ad

---

**Last Updated:** November 11, 2025
**API Version:** Meta Marketing API v24.0
**Poppy Version:** Current
