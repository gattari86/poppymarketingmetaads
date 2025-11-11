# Meta Ads Creation - Complete Visual Workflow

## Overview: Two Valid Approaches

```
┌─────────────────────────────────────────────────────────────┐
│                   USER'S GOAL: CREATE AN AD                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Choose Method  │
                    └─────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐
    │   OPTION 1:     │             │   OPTION 2:     │
    │  API-First      │             │   UI-First      │
    │  (Automated)    │             │  (Manual)       │
    └─────────────────┘             └─────────────────┘
```

---

## Option 1: API-First Approach (Programmatic) ✅

### Complete Workflow - 4 Steps Required

```
┌───────────────────────────────────────────────────────────────────┐
│ STEP 1: CREATE CAMPAIGN                                           │
│                                                                   │
│ POST /v24.0/act_{ad_account_id}/campaigns                        │
│ {                                                                │
│   "name": "My Campaign",                                         │
│   "objective": "OUTCOME_TRAFFIC",                                │
│   "status": "PAUSED",                                            │
│   "daily_budget": 5000,                                          │
│   "buying_type": "AUCTION"                                       │
│ }                                                                │
│                                                                  │
│ RETURNS: { "id": "campaign_id_123" }                            │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│ STEP 2: CREATE AD SET                                             │
│                                                                   │
│ POST /v24.0/act_{ad_account_id}/adsets                           │
│ {                                                                │
│   "name": "My Ad Set",                                           │
│   "campaign_id": "campaign_id_123",                              │
│   "status": "PAUSED",                                            │
│   "optimization_goal": "REACH",                                  │
│   "billing_event": "IMPRESSIONS",                                │
│   "targeting": {                                                 │
│     "geo_locations": { "countries": ["US"] },                    │
│     "age_min": 18,                                               │
│     "age_max": 65                                                │
│   }                                                              │
│ }                                                                │
│                                                                  │
│ RETURNS: { "id": "adset_id_456" }                               │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│ STEP 3: CREATE CREATIVE (THE CRITICAL STEP!)                     │
│                                                                   │
│ 3A: Upload Image First                                           │
│ POST /v24.0/act_{ad_account_id}/adimages                         │
│ FormData: { filename: image.jpg }                                │
│                                                                  │
│ RETURNS: { "images": { "image.jpg": { "hash": "abc123" } } }    │
│                                                                  │
│         │                                                        │
│         ▼                                                        │
│                                                                  │
│ 3B: Create Creative with Image Hash                             │
│ POST /v24.0/act_{ad_account_id}/adcreatives                      │
│ {                                                                │
│   "name": "My Creative",                                         │
│   "object_story_spec": {                                         │
│     "page_id": "page_id_789",                                    │
│     "link_data": {                                               │
│       "image_hash": "abc123",                                    │
│       "link": "https://yourdomain.com",                          │
│       "message": "Check out our product!",                       │
│       "name": "Amazing Product",                                 │
│       "call_to_action": { "type": "LEARN_MORE" }                 │
│     }                                                            │
│   }                                                              │
│ }                                                                │
│                                                                  │
│ RETURNS: { "id": "creative_id_999" }  ← SAVE THIS ID!           │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│ STEP 4: CREATE AD (Using creative_id from Step 3)                │
│                                                                   │
│ POST /v24.0/act_{ad_account_id}/ads                              │
│ {                                                                │
│   "name": "My Ad",                                               │
│   "adset_id": "adset_id_456",                                    │
│   "creative": {                                                  │
│     "creative_id": "creative_id_999"  ← MUST USE THIS ID        │
│   },                                                             │
│   "status": "PAUSED"                                             │
│ }                                                                │
│                                                                  │
│ RETURNS: { "id": "ad_id_111" }                                  │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   AD CREATED    │
                    │    SUCCESS! ✅   │
                    └─────────────────┘
```

---

## Option 2: UI-First Approach (Manual)

### Workflow - Mix of UI and API

```
┌───────────────────────────────────────────────────────────────────┐
│ STEP 1: CREATE CAMPAIGN (API or UI)                              │
│                                                                   │
│ Either use API call OR create in Meta Ads Manager                │
│                                                                   │
│ RESULT: campaign_id_123                                          │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│ STEP 2: CREATE AD SET (API or UI)                                │
│                                                                   │
│ Either use API call OR create in Meta Ads Manager                │
│                                                                   │
│ RESULT: adset_id_456                                             │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│ STEP 3: CREATE CREATIVE (IN META ADS MANAGER UI)                 │
│                                                                   │
│ 1. Go to Meta Ads Manager (https://business.facebook.com)        │
│ 2. Navigate to: Assets → Creatives                               │
│ 3. Click "Create" button                                         │
│ 4. Upload image, add text, headline, CTA                         │
│ 5. Save creative                                                 │
│ 6. Copy the creative_id from the URL or creative list           │
│                                                                   │
│ RESULT: creative_id_999                                          │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────────┐
│ STEP 4: CREATE AD (API with creative_id from UI)                 │
│                                                                   │
│ POST /v24.0/act_{ad_account_id}/ads                              │
│ {                                                                │
│   "name": "My Ad",                                               │
│   "adset_id": "adset_id_456",                                    │
│   "creative": {                                                  │
│     "creative_id": "creative_id_999"  ← FROM ADS MANAGER        │
│   },                                                             │
│   "status": "PAUSED"                                             │
│ }                                                                │
│                                                                  │
│ RETURNS: { "id": "ad_id_111" }                                  │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   AD CREATED    │
                    │    SUCCESS! ✅   │
                    └─────────────────┘
```

---

## The Common Error: What NOT to Do ❌

### WRONG Approach - Trying to Create Ad Without Creative

```
┌───────────────────────────────────────────────────────────────────┐
│ USER ATTEMPTS: Create ad with inline creative details            │
│                                                                   │
│ POST /v24.0/act_{ad_account_id}/ads                              │
│ {                                                                │
│   "name": "My Ad",                                               │
│   "adset_id": "adset_id_456",                                    │
│   "creative": {                                                  │
│     "title": "Headline",      ← ❌ WRONG! Not valid             │
│     "body": "Ad text",        ← ❌ WRONG! Not valid             │
│     "image_url": "https://..."← ❌ WRONG! Not valid             │
│   }                                                              │
│ }                                                                │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  ❌ ERROR! ❌    │
                    │                 │
                    │ "No creative    │
                    │ spec found for  │
                    │ given adgroup"  │
                    └─────────────────┘
```

### WHY IT FAILS:

```
┌─────────────────────────────────────────────────────────────┐
│ The /ads endpoint ONLY accepts:                            │
│                                                             │
│ {                                                           │
│   "creative": {                                             │
│     "creative_id": "123456789"  ← ONLY THIS FIELD WORKS    │
│   }                                                         │
│ }                                                           │
│                                                             │
│ It does NOT accept inline creative details like:           │
│ - title, body, image_url, message, etc.                    │
│                                                             │
│ The creative MUST EXIST FIRST with its own ID.             │
└─────────────────────────────────────────────────────────────┘
```

---

## Comparison: API vs UI Approach

```
┌─────────────────────┬───────────────────┬───────────────────┐
│     Feature         │   API Approach    │   UI Approach     │
├─────────────────────┼───────────────────┼───────────────────┤
│ Speed               │ Fast (automated)  │ Slow (manual)     │
│ Scalability         │ High (bulk ops)   │ Low (one by one)  │
│ Preview             │ API preview only  │ Visual preview    │
│ User Experience     │ Single interface  │ Multi-interface   │
│ Technical Skill     │ Medium-High       │ Low               │
│ Error Risk          │ Medium (API)      │ Low (UI validation)│
│ Best For            │ Automation/scale  │ One-off/testing   │
└─────────────────────┴───────────────────┴───────────────────┘
```

---

## Creative Reuse Pattern

### Single Creative, Multiple Ads

```
┌───────────────────────────────────────────────────────────────────┐
│ CREATE CREATIVE ONCE                                              │
│                                                                   │
│ POST /adcreatives → Returns: creative_id_999                     │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ├────────────────┬─────────────────┐
                              ▼                ▼                 ▼
                    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
                    │   Ad Set 1  │  │   Ad Set 2  │  │   Ad Set 3  │
                    │             │  │             │  │             │
                    │ POST /ads   │  │ POST /ads   │  │ POST /ads   │
                    │ creative_id │  │ creative_id │  │ creative_id │
                    │    _999     │  │    _999     │  │    _999     │
                    └─────────────┘  └─────────────┘  └─────────────┘
                          │                  │                 │
                          ▼                  ▼                 ▼
                    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
                    │   Ad 1      │  │   Ad 2      │  │   Ad 3      │
                    │ 18-24 y/o   │  │ 25-34 y/o   │  │ 35-44 y/o   │
                    │ New York    │  │ Los Angeles │  │ Chicago     │
                    └─────────────┘  └─────────────┘  └─────────────┘

RESULT: Same creative shown to 3 different audiences!
```

---

## Error Handling Flow

```
┌───────────────────────────────────────────────────────────────────┐
│ TRY: Create Ad                                                    │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   API Response  │
                    └─────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐
    │   SUCCESS ✅     │             │   ERROR ❌       │
    │                 │             │                 │
    │ Returns ad_id   │             │ Returns error   │
    └─────────────────┘             └─────────────────┘
                                               │
                                    ┌──────────┴──────────┐
                                    ▼                     ▼
                          ┌──────────────────┐  ┌──────────────────┐
                          │ "No creative     │  │ "WITH_ISSUES"    │
                          │  spec found"     │  │  status          │
                          │                  │  │                  │
                          │ FIX: Create      │  │ FIX: Check       │
                          │ creative first!  │  │ creative fields  │
                          └──────────────────┘  └──────────────────┘
                                    │                     │
                                    ▼                     ▼
                          ┌──────────────────┐  ┌──────────────────┐
                          │ POST /adcreatives│  │ GET /{creative}  │
                          │ Get creative_id  │  │ ?fields=status   │
                          └──────────────────┘  └──────────────────┘
                                    │                     │
                                    └──────────┬──────────┘
                                               ▼
                                    ┌─────────────────┐
                                    │  RETRY with     │
                                    │  valid          │
                                    │  creative_id    │
                                    └─────────────────┘
```

---

## Data Flow: Complete Campaign Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         AD ACCOUNT                              │
│                     (act_123456789)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
    ┌───────────────────────┐   ┌───────────────────────┐
    │     CAMPAIGN          │   │   CREATIVES LIBRARY   │
    │  (campaign_id_123)    │   │                       │
    │                       │   │  - creative_id_999    │
    │ • Budget: $50/day     │   │  - creative_id_888    │
    │ • Objective: Traffic  │   │  - creative_id_777    │
    └───────────────────────┘   └───────────────────────┘
                │                           │
                ▼                           │
    ┌───────────────────────┐              │
    │      AD SET           │              │
    │   (adset_id_456)      │              │
    │                       │              │
    │ • Target: US 18-65    │              │
    │ • Placement: Feed     │              │
    └───────────────────────┘              │
                │                           │
                ▼                           │
    ┌───────────────────────┐              │
    │       AD              │              │
    │    (ad_id_111)        │◄─────────────┘
    │                       │   References
    │ • Name: "My Ad"       │   creative_id_999
    │ • Status: PAUSED      │
    │ • Creative: 999       │
    └───────────────────────┘
```

---

## Required Permissions Flow

```
┌───────────────────────────────────────────────────────────────────┐
│ META APP PERMISSIONS REQUIRED                                     │
└───────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  App Dashboard  │
                    └─────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
    ┌───────────────────────┐   ┌───────────────────────┐
    │ STANDARD ACCESS       │   │  ADVANCED ACCESS      │
    │                       │   │                       │
    │ • ads_management      │   │ • business_management │
    │   (required for ads)  │   │   (for business ops)  │
    │                       │   │                       │
    │ Sufficient for:       │   │ Required for:         │
    │ ✅ Create campaigns   │   │ ✅ Manage other       │
    │ ✅ Create ad sets     │   │    ad accounts        │
    │ ✅ Create creatives   │   │ ✅ Business-level ops │
    │ ✅ Create ads         │   │                       │
    │ ✅ Own ad accounts    │   │                       │
    └───────────────────────┘   └───────────────────────┘
```

---

## Poppy Ads Manager - Current vs Future

### Current Implementation (Option 2 - UI First)

```
┌─────────────────────────────────────────────────────────────────┐
│ POPPY CURRENT WORKFLOW                                          │
└─────────────────────────────────────────────────────────────────┘

    User in Poppy                    User in Meta Ads Manager
    ─────────────                    ────────────────────────

    1. Create Campaign ──────────┐
       via API                   │
                                 │
    2. Create Ad Set ─────────┐  │
       via API               │  │
                             │  │
                             │  │   3. [Switch to Ads Manager]
                             │  │      Navigate to Creatives
                             │  │      Upload image
                             │  │      Add text, CTA
                             │  │      Save creative
                             │  │      Copy creative_id
                             │  │
    4. Paste creative_id ◄───┘  │   [Switch back to Poppy]
       Create ad via API        │
                                │
    5. ✅ Ad Created            │
```

### Recommended Enhancement (Option 1 - API First)

```
┌─────────────────────────────────────────────────────────────────┐
│ POPPY ENHANCED WORKFLOW                                         │
└─────────────────────────────────────────────────────────────────┘

    All in Poppy Interface
    ──────────────────────

    1. Create Campaign
       via API
       ↓
    2. Create Ad Set
       via API
       ↓
    3. Upload Image
       (drag & drop)
       ↓
    4. Enter Creative Details
       • Headline
       • Body text
       • CTA button
       • Landing URL
       ↓
    5. Create Creative via API
       (uploadAdImage + createAdCreative)
       ↓
    6. Create Ad via API
       (using creative_id from step 5)
       ↓
    7. ✅ Ad Created

    No context switching required!
```

---

## Summary Decision Tree

```
                    START: Need to create an ad
                              │
                              ▼
                    Do you have existing
                    campaign & ad set?
                              │
                    ┌─────────┴─────────┐
                   NO                  YES
                    │                   │
                    ▼                   ▼
            Create Campaign      Skip to creative
            Create Ad Set              │
                    │                   │
                    └─────────┬─────────┘
                              ▼
                    Do you want automation
                    or manual control?
                              │
                    ┌─────────┴─────────┐
              AUTOMATION            MANUAL
                    │                   │
                    ▼                   ▼
        Use API to:           Go to Ads Manager:
        1. Upload image       1. Create creative
        2. Create creative    2. Get creative_id
        3. Create ad          3. Use API to create ad
                    │                   │
                    └─────────┬─────────┘
                              ▼
                        Ad Created! ✅
```

---

**Last Updated:** November 10, 2025
**For:** Poppy Ads Manager - Meta Marketing API v24.0
