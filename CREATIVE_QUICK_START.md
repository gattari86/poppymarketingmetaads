# Meta API Creative Creation - Quick Start Guide

**TL;DR:** You CAN create creatives via API. You must create the creative BEFORE creating the ad.

---

## The Problem Users Encounter

**Error:** "No creative spec found for given adgroup"

**Why:** Trying to create an ad without first creating a creative. The ad endpoint requires `creative_id`.

---

## The Solution: Two Options

### Option 1: Create Creative via API (Automated) ✅

**3-Step Process:**

```bash
# Step 1: Upload Image
curl -F "filename=@image.jpg" \
  "https://graph.facebook.com/v24.0/act_{ad_account_id}/adimages?access_token={token}"
# Returns: {"images":{"image.jpg":{"hash":"abc123"}}}

# Step 2: Create Creative
curl -X POST \
  "https://graph.facebook.com/v24.0/act_{ad_account_id}/adcreatives?access_token={token}" \
  -d "name=My Creative" \
  -d "object_story_spec={\"page_id\":\"123\",\"link_data\":{\"image_hash\":\"abc123\",\"link\":\"https://url.com\",\"message\":\"Text\",\"name\":\"Headline\"}}"
# Returns: {"id":"456789"}

# Step 3: Create Ad (using creative_id)
curl -X POST \
  "https://graph.facebook.com/v24.0/act_{ad_account_id}/ads?access_token={token}" \
  -d "name=My Ad" \
  -d "adset_id={adset_id}" \
  -d "creative={\"creative_id\":\"456789\"}" \
  -d "status=PAUSED"
# Returns: {"id":"789012"}
```

### Option 2: Use Existing Creative from Ads Manager

**2-Step Process:**

```bash
# Step 1: Create creative in Meta Ads Manager UI
# Copy the creative_id (found in Assets → Creatives)

# Step 2: Create Ad with that ID
curl -X POST \
  "https://graph.facebook.com/v24.0/act_{ad_account_id}/ads?access_token={token}" \
  -d "adset_id={adset_id}" \
  -d "creative={\"creative_id\":\"{your_creative_id}\"}"
```

---

## Minimal Working Example (Node.js)

```javascript
const axios = require('axios');

async function createAdWithCreative() {
  const API = 'https://graph.facebook.com/v24.0';
  const TOKEN = 'YOUR_ACCESS_TOKEN';
  const ACCOUNT = 'act_123456789';
  const PAGE_ID = 'YOUR_PAGE_ID';
  const ADSET_ID = 'YOUR_ADSET_ID';

  // Step 1: Upload image
  const FormData = require('form-data');
  const fs = require('fs');
  const form = new FormData();
  form.append('filename', fs.createReadStream('./image.jpg'));
  form.append('access_token', TOKEN);

  const imageRes = await axios.post(`${API}/${ACCOUNT}/adimages`, form, {
    headers: form.getHeaders()
  });
  const imageHash = Object.values(imageRes.data.images)[0].hash;

  // Step 2: Create creative
  const creativeRes = await axios.post(`${API}/${ACCOUNT}/adcreatives`, {
    name: 'My Creative',
    object_story_spec: {
      page_id: PAGE_ID,
      link_data: {
        image_hash: imageHash,
        link: 'https://yoursite.com',
        message: 'Check this out!',
        name: 'Amazing Product',
        call_to_action: { type: 'LEARN_MORE' }
      }
    },
    access_token: TOKEN
  });
  const creativeId = creativeRes.data.id;

  // Step 3: Create ad
  const adRes = await axios.post(`${API}/${ACCOUNT}/ads`, {
    name: 'My Ad',
    adset_id: ADSET_ID,
    creative: { creative_id: creativeId },
    status: 'PAUSED',
    access_token: TOKEN
  });

  return adRes.data.id;
}
```

---

## Required Fields for object_story_spec

**Minimum for Link Ad:**
```json
{
  "page_id": "123",           // Required: Your Facebook Page ID
  "link_data": {
    "image_hash": "abc123",   // Required: From image upload
    "link": "https://url.com", // Required: Landing page URL
    "message": "Ad text"      // Required: Ad body text
  }
}
```

**Common Optional Fields:**
```json
{
  "name": "Headline text",              // Ad headline
  "description": "Description text",     // Additional description
  "call_to_action": {
    "type": "LEARN_MORE"                // CTA button type
  }
}
```

**For Instagram:**
```json
{
  "page_id": "123",
  "instagram_user_id": "456",  // Add this for Instagram placement
  "link_data": { ... }
}
```

---

## Common Errors & Quick Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "No creative spec found" | No creative_id provided | Create creative first, then use ID |
| "WITH_ISSUES status" | Creative has validation errors | Check creative status, fix issues |
| "App in development mode" | Meta app not live | Switch app to Live Mode |
| "Permission Error" | Missing ads_management | Add permission in App Review |
| "Unsupported post request" | Image doesn't meet requirements | Resize to 1080x1080+, <30MB |

---

## Call-to-Action Types

Valid `call_to_action.type` values:
- `LEARN_MORE` - Learn More (most common)
- `SHOP_NOW` - Shop Now
- `SIGN_UP` - Sign Up
- `DOWNLOAD` - Download
- `WATCH_MORE` - Watch More
- `CONTACT_US` - Contact Us
- `APPLY_NOW` - Apply Now
- `GET_QUOTE` - Get Quote
- `BOOK_TRAVEL` - Book Now
- `NO_BUTTON` - No button

---

## Best Practice: The Right Workflow

```
❌ WRONG: Try to create ad with inline creative details
{
  "adset_id": "123",
  "creative": {
    "title": "Headline",
    "body": "Text",
    "image_url": "https://..."
  }
}
→ ERROR: No creative spec found

✅ CORRECT: Create creative first, then reference ID
Step 1: POST /adcreatives → Returns creative_id
Step 2: POST /ads with { "creative": { "creative_id": "..." } }
→ SUCCESS
```

---

## When to Use Each Approach

**Use API Creation (Option 1) when:**
- Building automation/tools
- Creating ads at scale
- Need programmatic workflow
- Want single-interface experience

**Use Ads Manager (Option 2) when:**
- Creating one-off ads
- Want visual preview first
- Testing creative formats
- Not familiar with API yet

---

## Poppy Ads Manager Status

**Current:** Uses Option 2 (manual creative creation in Ads Manager)

**Recommended:** Add Option 1 (programmatic creation)

**Implementation:**
- Add `/api/creatives` endpoint
- Add image upload UI component
- Update ad creation form
- Enable full automation

See `META_API_CREATIVE_CREATION_GUIDE.md` for complete implementation details.

---

## Resources

- Full Guide: `META_API_CREATIVE_CREATION_GUIDE.md`
- API Reference: `META_API_V24_REFERENCE.md`
- Current Implementation: `lib/meta-api.ts`

---

**Last Updated:** November 10, 2025
