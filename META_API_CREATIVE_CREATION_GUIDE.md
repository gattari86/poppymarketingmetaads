# Meta Marketing API v24 - Creative Creation & Ad Management Guide
## Complete Workflow for Programmatic Ad Creation

**Last Updated:** November 10, 2025
**API Version:** Meta Marketing API v24.0
**Status:** Production-Ready Reference

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Creative Creation Options](#creative-creation-options)
3. [API Structure & Required Fields](#api-structure--required-fields)
4. [Complete Workflow Examples](#complete-workflow-examples)
5. [Common Errors & Solutions](#common-errors--solutions)
6. [Best Practices](#best-practices)
7. [Current Poppy Implementation](#current-poppy-implementation)

---

## Executive Summary

### Key Finding: Creatives CAN Be Created Via API ✅

**Yes, you CAN create ad creatives programmatically using the Meta Marketing API.** You do NOT need to create them manually in Meta Ads Manager first.

### Two Approaches Available:

1. **Create Creative via API First (Recommended)** - Use `POST /act_{ad_account_id}/adcreatives` to create creative, then use returned `creative_id` when creating ad
2. **Reference Existing Creative** - Create creative in Ads Manager UI, get ID, then reference it in API

### The Required Workflow:
```
Step 1: Create Campaign → Returns campaign_id
Step 2: Create Ad Set → Returns adset_id
Step 3: Create Ad Creative → Returns creative_id ⭐ THIS IS THE MISSING STEP
Step 4: Create Ad (using creative_id) → Returns ad_id
```

**The mistake users commonly make:** Trying to create an ad WITHOUT first having a creative_id. The ad creation endpoint requires a `creative_id` - it cannot create the creative inline.

---

## Creative Creation Options

### Option A: Create Creative via API (Programmatic) ✅ RECOMMENDED

**Endpoint:** `POST /v24.0/act_{ad_account_id}/adcreatives`

**Advantages:**
- Fully automated workflow
- No manual UI interaction needed
- Can be done in same session as ad creation
- Scalable for bulk operations

**When to use:**
- Building ad creation tools/platforms
- Automating ad creation at scale
- Creating similar creatives programmatically
- When you have all creative assets ready

### Option B: Create in Ads Manager, Reference in API

**Process:**
1. Log into Meta Ads Manager
2. Navigate to Assets → Creatives
3. Create creative with images, text, CTA
4. Copy the creative ID
5. Use that ID in your API call

**Advantages:**
- Visual preview before creation
- Access to Meta's creative preview tools
- Easier for one-off creatives
- Lower risk of formatting errors

**When to use:**
- Creating a few ads manually
- Need to see visual preview first
- Testing creative formats
- Don't have API integration ready

---

## API Structure & Required Fields

### 1. Create Ad Creative Endpoint

**Endpoint:** `POST /v24.0/act_{ad_account_id}/adcreatives`

**Required Parameters:**
- `access_token` (in URL params)
- `name` (creative name for reference)
- Either `object_story_id` OR `object_story_spec` (creative content)

#### Method 1: Using object_story_spec (Most Common)

**For Link Ads (Single Image + Link):**
```json
{
  "name": "My Creative Name",
  "object_story_spec": {
    "page_id": "YOUR_PAGE_ID",
    "link_data": {
      "image_hash": "IMAGE_HASH_FROM_UPLOAD",
      "link": "https://yourdomain.com",
      "message": "Ad body text goes here",
      "name": "Headline text",
      "description": "Description text",
      "call_to_action": {
        "type": "LEARN_MORE"
      }
    }
  }
}
```

**For Single Image Ads (No Link):**
```json
{
  "name": "Photo Creative",
  "object_story_spec": {
    "page_id": "YOUR_PAGE_ID",
    "photo_data": {
      "image_hash": "IMAGE_HASH_FROM_UPLOAD",
      "caption": "Photo caption text"
    }
  }
}
```

**For Video Ads:**
```json
{
  "name": "Video Creative",
  "object_story_spec": {
    "page_id": "YOUR_PAGE_ID",
    "video_data": {
      "video_id": "VIDEO_ID_FROM_UPLOAD",
      "message": "Video description",
      "title": "Video title",
      "call_to_action": {
        "type": "WATCH_MORE"
      }
    }
  }
}
```

**For Instagram Ads (Cross-Platform):**
```json
{
  "name": "Instagram Creative",
  "object_story_spec": {
    "page_id": "YOUR_PAGE_ID",
    "instagram_user_id": "YOUR_IG_USER_ID",
    "link_data": {
      "image_hash": "IMAGE_HASH",
      "link": "https://yourdomain.com",
      "message": "Instagram caption"
    }
  }
}
```

#### Method 2: Using object_story_id (Reference Existing Post)

**For Existing Facebook Post:**
```json
{
  "name": "Boost Existing Post",
  "object_story_id": "{page_id}_{post_id}"
}
```

**Note:** This method promotes an existing Facebook Page post as an ad. The post must already exist on your Facebook Page.

### Important Field Details

#### image_hash - How to Get It
Before creating the creative, you must upload the image to your ad account:

**Image Upload Endpoint:** `POST /v24.0/act_{ad_account_id}/adimages`

```bash
curl -F "filename=@/path/to/image.jpg" \
  -F "access_token=YOUR_ACCESS_TOKEN" \
  "https://graph.facebook.com/v24.0/act_{ad_account_id}/adimages"
```

**Response:**
```json
{
  "images": {
    "image.jpg": {
      "hash": "9935dd57c2ce958f98c5d17035603b2f",
      "url": "https://..."
    }
  }
}
```

Use the `hash` value in your `object_story_spec`.

#### video_id - How to Get It
**Video Upload Endpoint:** `POST /v24.0/act_{ad_account_id}/advideos`

```bash
curl -F "source=@/path/to/video.mp4" \
  -F "access_token=YOUR_ACCESS_TOKEN" \
  "https://graph.facebook.com/v24.0/act_{ad_account_id}/advideos"
```

**Response:**
```json
{
  "id": "1234567890"
}
```

Use the `id` value as your `video_id`.

#### call_to_action Types
Available CTA button types:
- `LEARN_MORE` - Learn More
- `SHOP_NOW` - Shop Now
- `SIGN_UP` - Sign Up
- `DOWNLOAD` - Download
- `WATCH_MORE` - Watch More
- `BOOK_TRAVEL` - Book Now
- `CONTACT_US` - Contact Us
- `APPLY_NOW` - Apply Now
- `GET_QUOTE` - Get Quote
- `SUBSCRIBE` - Subscribe
- `NO_BUTTON` - No button

### 2. Create Ad Endpoint (Using the Creative)

**Endpoint:** `POST /v24.0/act_{ad_account_id}/ads`

**Required Parameters:**
```json
{
  "name": "My Ad Name",
  "adset_id": "ADSET_ID_FROM_STEP_2",
  "creative": {
    "creative_id": "CREATIVE_ID_FROM_STEP_3"
  },
  "status": "PAUSED"
}
```

**Important:** The `creative` object ONLY accepts `creative_id`. You cannot pass inline creative details here. The creative must already exist.

---

## Complete Workflow Examples

### Full Workflow: Image Ad Creation (cURL)

```bash
# Step 1: Create Campaign
curl -X POST \
  "https://graph.facebook.com/v24.0/act_123456789/campaigns" \
  -d "name=My Campaign" \
  -d "objective=OUTCOME_TRAFFIC" \
  -d "status=PAUSED" \
  -d "daily_budget=5000" \
  -d "buying_type=AUCTION" \
  -d "special_ad_categories=[]" \
  -d "access_token=YOUR_TOKEN"

# Returns: {"id": "120202345678901234"}

# Step 2: Create Ad Set
curl -X POST \
  "https://graph.facebook.com/v24.0/act_123456789/adsets" \
  -d "name=My Ad Set" \
  -d "campaign_id=120202345678901234" \
  -d "status=PAUSED" \
  -d "optimization_goal=REACH" \
  -d "billing_event=IMPRESSIONS" \
  -d "bid_amount=500" \
  -d "targeting={\"geo_locations\":{\"countries\":[\"US\"]},\"age_min\":18,\"age_max\":65}" \
  -d "access_token=YOUR_TOKEN"

# Returns: {"id": "120203345678901234"}

# Step 3a: Upload Image
curl -F "filename=@./ad-image.jpg" \
  -F "access_token=YOUR_TOKEN" \
  "https://graph.facebook.com/v24.0/act_123456789/adimages"

# Returns: {"images":{"ad-image.jpg":{"hash":"abc123def456"}}}

# Step 3b: Create Ad Creative
curl -X POST \
  "https://graph.facebook.com/v24.0/act_123456789/adcreatives" \
  -d "name=My Creative" \
  -d "object_story_spec={
    \"page_id\":\"114132124974698\",
    \"link_data\":{
      \"image_hash\":\"abc123def456\",
      \"link\":\"https://yourdomain.com\",
      \"message\":\"Check out our amazing product!\",
      \"name\":\"Best Product Ever\",
      \"description\":\"Limited time offer\",
      \"call_to_action\":{\"type\":\"LEARN_MORE\"}
    }
  }" \
  -d "access_token=YOUR_TOKEN"

# Returns: {"id": "120204345678901234"}

# Step 4: Create Ad (using creative_id)
curl -X POST \
  "https://graph.facebook.com/v24.0/act_123456789/ads" \
  -d "name=My Ad" \
  -d "adset_id=120203345678901234" \
  -d "creative={\"creative_id\":\"120204345678901234\"}" \
  -d "status=PAUSED" \
  -d "access_token=YOUR_TOKEN"

# Returns: {"id": "120205345678901234"}

# Success! You now have a complete ad ready to activate.
```

### Full Workflow: Node.js/TypeScript Implementation

```typescript
import axios from 'axios';

const API_VERSION = 'v24.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';
const AD_ACCOUNT_ID = 'act_123456789';
const PAGE_ID = 'YOUR_PAGE_ID';

async function createCompleteAd() {
  try {
    // Step 1: Create Campaign
    const campaignResponse = await axios.post(
      `${BASE_URL}/${AD_ACCOUNT_ID}/campaigns`,
      {
        name: 'My Campaign',
        objective: 'OUTCOME_TRAFFIC',
        status: 'PAUSED',
        daily_budget: 5000,
        buying_type: 'AUCTION',
        special_ad_categories: [],
        access_token: ACCESS_TOKEN
      }
    );
    const campaignId = campaignResponse.data.id;
    console.log('Campaign created:', campaignId);

    // Step 2: Create Ad Set
    const adSetResponse = await axios.post(
      `${BASE_URL}/${AD_ACCOUNT_ID}/adsets`,
      {
        name: 'My Ad Set',
        campaign_id: campaignId,
        status: 'PAUSED',
        optimization_goal: 'REACH',
        billing_event: 'IMPRESSIONS',
        bid_amount: 500,
        targeting: {
          geo_locations: { countries: ['US'] },
          age_min: 18,
          age_max: 65
        },
        access_token: ACCESS_TOKEN
      }
    );
    const adSetId = adSetResponse.data.id;
    console.log('Ad Set created:', adSetId);

    // Step 3a: Upload Image
    const FormData = require('form-data');
    const fs = require('fs');
    const imageForm = new FormData();
    imageForm.append('filename', fs.createReadStream('./ad-image.jpg'));
    imageForm.append('access_token', ACCESS_TOKEN);

    const imageResponse = await axios.post(
      `${BASE_URL}/${AD_ACCOUNT_ID}/adimages`,
      imageForm,
      { headers: imageForm.getHeaders() }
    );

    const imageHash = Object.values(imageResponse.data.images)[0].hash;
    console.log('Image uploaded:', imageHash);

    // Step 3b: Create Ad Creative
    const creativeResponse = await axios.post(
      `${BASE_URL}/${AD_ACCOUNT_ID}/adcreatives`,
      {
        name: 'My Creative',
        object_story_spec: {
          page_id: PAGE_ID,
          link_data: {
            image_hash: imageHash,
            link: 'https://yourdomain.com',
            message: 'Check out our amazing product!',
            name: 'Best Product Ever',
            description: 'Limited time offer',
            call_to_action: { type: 'LEARN_MORE' }
          }
        },
        access_token: ACCESS_TOKEN
      }
    );
    const creativeId = creativeResponse.data.id;
    console.log('Creative created:', creativeId);

    // Step 4: Create Ad
    const adResponse = await axios.post(
      `${BASE_URL}/${AD_ACCOUNT_ID}/ads`,
      {
        name: 'My Ad',
        adset_id: adSetId,
        creative: { creative_id: creativeId },
        status: 'PAUSED',
        access_token: ACCESS_TOKEN
      }
    );
    const adId = adResponse.data.id;
    console.log('Ad created:', adId);

    return {
      campaignId,
      adSetId,
      creativeId,
      adId
    };

  } catch (error) {
    console.error('Error creating ad:', error.response?.data || error.message);
    throw error;
  }
}

// Run the workflow
createCompleteAd().then(result => {
  console.log('Complete ad creation successful:', result);
});
```

### Dynamic Creative (Multiple Images/Texts)

**For A/B testing multiple variations:**

```json
{
  "name": "Dynamic Creative",
  "object_story_spec": {
    "page_id": "YOUR_PAGE_ID",
    "instagram_user_id": "YOUR_IG_USER_ID"
  },
  "asset_feed_spec": {
    "images": [
      {"hash": "IMAGE_HASH_1"},
      {"hash": "IMAGE_HASH_2"},
      {"hash": "IMAGE_HASH_3"}
    ],
    "bodies": [
      {"text": "Body text option 1"},
      {"text": "Body text option 2"},
      {"text": "Body text option 3"}
    ],
    "titles": [
      {"text": "Headline 1"},
      {"text": "Headline 2"}
    ],
    "descriptions": [
      {"text": "Description text"}
    ],
    "ad_formats": ["SINGLE_IMAGE"],
    "link_urls": [
      {"website_url": "https://yourdomain.com"}
    ],
    "call_to_action_types": ["LEARN_MORE"]
  }
}
```

**Limits:**
- Maximum 30 total assets
- Up to 10 images
- Up to 10 videos
- Up to 5 bodies
- Up to 5 titles
- Up to 5 descriptions
- Up to 5 CTAs

---

## Common Errors & Solutions

### Error 1: "No creative spec found for given adgroup"

**Cause:** Trying to create an ad without providing a `creative_id`.

**Solution:** Create the creative first using the `/adcreatives` endpoint, then use the returned ID.

**Wrong:**
```json
{
  "name": "My Ad",
  "adset_id": "123",
  "creative": {
    "title": "Headline",
    "body": "Text"
  }
}
```

**Correct:**
```json
{
  "name": "My Ad",
  "adset_id": "123",
  "creative": {
    "creative_id": "456789"
  }
}
```

### Error 2: "Creating ad using ad creative with WITH_ISSUES status is not allowed"

**Cause:** The creative has validation issues (missing required fields, invalid image, policy violations).

**Solution:**
1. Check creative status: `GET /v24.0/{creative_id}?fields=status`
2. Fix the issues in the creative
3. Or create a new creative with correct parameters

### Error 3: "Ads creative post was created by an app that is in development mode"

**Cause:** Your Meta app is still in Development Mode, which restricts ad creation.

**Solution:**
1. Go to Meta App Settings
2. Switch app to Live Mode
3. Ensure you have `ads_management` permissions approved

### Error 4: "enroll_status was not provided"

**Cause:** Creative is eligible for Standard Enhancements but you didn't specify whether to enable them.

**Solution:** Add `enroll_status` field:
```json
{
  "name": "My Creative",
  "object_story_spec": { ... },
  "enroll_status": "OPT_IN"  // or "OPT_OUT"
}
```

### Error 5: "Unsupported post request" (Image Dimension Issues)

**Cause:** Image doesn't meet Meta's requirements (aspect ratio, size, format).

**Requirements:**
- Format: JPG or PNG
- Aspect ratio: 1.91:1 to 4:5 (depending on placement)
- Resolution: At least 1080 x 1080 pixels (square)
- File size: Max 30 MB
- Text in image: Less than 20% recommended

**Solution:**
1. Resize/reformat image to meet requirements
2. Upload again to get new hash
3. Use new hash in creative

### Error 6: "Permission Error"

**Cause:** App doesn't have required permissions.

**Required Permissions:**
- `ads_management` - Standard Access required
- `business_management` - For business-level operations

**Solution:**
1. Go to Meta App Dashboard
2. Add permissions under App Review
3. Submit for Standard Access or Advanced Access
4. Wait for approval

---

## Best Practices

### 1. Creative Creation Strategy

**For Automated Systems (API-First):**
- Upload all images/videos first, store hashes
- Create creatives in bulk using stored hashes
- Validate creative status before creating ads
- Use consistent naming conventions

**For Manual Systems (UI-First):**
- Create and preview creatives in Ads Manager
- Export creative IDs to your system
- Reference IDs when creating ads via API
- Better for one-off campaigns

### 2. Image/Video Upload Best Practices

- **Pre-validate media:** Check dimensions/size BEFORE uploading
- **Store hashes:** Save image_hash and video_id for reuse
- **Use consistent naming:** Match filename to creative name
- **Optimize files:** Compress images to reduce upload time
- **Handle errors gracefully:** Retry upload on failure

### 3. Creative Reuse

**Creatives can be reused across multiple ads:**

```javascript
// Create one creative
const creative = await createCreative(data);

// Use in multiple ads
await createAd(adSet1, creative.id);
await createAd(adSet2, creative.id);
await createAd(adSet3, creative.id);
```

**Benefits:**
- Faster ad creation
- Consistent branding
- Lower API call volume
- Easier A/B testing (same creative, different targeting)

### 4. Testing Creative Before Production

**Preview Creative:**
```
GET /v24.0/{creative_id}/previews?ad_format=DESKTOP_FEED_STANDARD
```

**Available Formats:**
- `DESKTOP_FEED_STANDARD`
- `MOBILE_FEED_STANDARD`
- `INSTAGRAM_STANDARD`
- `INSTAGRAM_STORY`
- `FACEBOOK_STORY_MOBILE`
- `AUDIENCE_NETWORK_OUTSTREAM_VIDEO`

### 5. Error Handling Pattern

```typescript
async function createCreativeWithRetry(data, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(`/adcreatives`, data);
      return response.data;
    } catch (error) {
      const metaError = error.response?.data?.error;

      // Check if error is recoverable
      if (metaError?.error_subcode === 1487741) {
        // Image upload failed - retry
        console.log(`Attempt ${attempt} failed, retrying...`);
        await new Promise(r => setTimeout(r, 1000 * attempt)); // Exponential backoff
        continue;
      }

      // Non-recoverable error
      console.error('Creative creation failed:', metaError);
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

### 6. Validation Before API Call

```typescript
function validateCreativeData(data) {
  const errors = [];

  // Required fields
  if (!data.name) errors.push('name is required');
  if (!data.object_story_spec?.page_id) errors.push('page_id is required');

  // Image validation
  if (data.object_story_spec?.link_data) {
    if (!data.object_story_spec.link_data.image_hash) {
      errors.push('image_hash is required for link ads');
    }
    if (!data.object_story_spec.link_data.link) {
      errors.push('link URL is required for link ads');
    }
  }

  // CTA validation
  const validCTAs = ['LEARN_MORE', 'SHOP_NOW', 'SIGN_UP', 'DOWNLOAD', 'WATCH_MORE'];
  const cta = data.object_story_spec?.link_data?.call_to_action?.type;
  if (cta && !validCTAs.includes(cta)) {
    errors.push(`Invalid CTA type: ${cta}`);
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }

  return true;
}
```

### 7. Rate Limiting

Meta has API rate limits. Best practices:
- **Batch operations** when possible
- **Implement exponential backoff** on rate limit errors
- **Cache responses** to reduce API calls
- **Use webhooks** for real-time updates instead of polling

**Rate Limit Error:**
```json
{
  "error": {
    "code": 17,
    "message": "User request limit reached"
  }
}
```

**Handle with retry:**
```typescript
if (error.response?.data?.error?.code === 17) {
  // Wait and retry
  await new Promise(r => setTimeout(r, 60000)); // Wait 1 minute
  return retry();
}
```

---

## Current Poppy Implementation

### Current Approach: Manual Creative Creation

**Documented in:** `/Users/ricardogattas-moras/poppy-ads-manager/META_API_V24_REFERENCE.md` (lines 103-122)

**Current Workflow:**
```
1. User logs into Meta Ads Manager
2. Creates or selects an Ad Creative (with image, text, CTA, link)
3. Gets the creative_id from Meta
4. Returns to Poppy Ads Manager
5. Pastes creative_id when creating Ad
6. Poppy posts to /api/ads with creative: { "creative_id": "..." }
```

### Current Code: `/Users/ricardogattas-moras/poppy-ads-manager/lib/meta-api.ts`

**Lines 233-276 - createAd function:**
```typescript
export async function createAd(
  adSetId: string,
  data: {
    name: string;
    adset_id?: string;
    creative: {
      creative_id?: string;
      title?: string;
      body?: string;
      image_url?: string;
    };
    status?: string;
  },
  accessToken: string
) {
  // Currently only handles creative_id
  // Does NOT create creatives programmatically
}
```

**Limitation:** The current implementation accepts creative details (`title`, `body`, `image_url`) but doesn't actually create the creative - it expects `creative_id` to already exist.

### Recommended Enhancement: Add Creative Creation Function

**Add to `/Users/ricardogattas-moras/poppy-ads-manager/lib/meta-api.ts`:**

```typescript
/**
 * Upload image to ad account and get hash
 */
export async function uploadAdImage(
  adAccountId: string,
  imageFile: File | Buffer,
  accessToken: string
) {
  try {
    const formattedId = formatAdAccountId(adAccountId);
    const FormData = require('form-data');
    const form = new FormData();

    form.append('filename', imageFile);
    form.append('access_token', accessToken);

    const response = await metaApi.post(
      `/${formattedId}/adimages`,
      form,
      { headers: form.getHeaders() }
    );

    // Extract hash from response
    const images = response.data.images;
    const imageHash = Object.values(images)[0].hash;

    return { hash: imageHash, url: Object.values(images)[0].url };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Create ad creative with object_story_spec
 */
export async function createAdCreative(
  adAccountId: string,
  data: {
    name: string;
    pageId: string;
    imageHash: string;
    link: string;
    message: string;
    headline: string;
    description?: string;
    callToAction?: string;
    instagramUserId?: string;
  },
  accessToken: string
) {
  try {
    const formattedId = formatAdAccountId(adAccountId);

    const creativeData = {
      name: data.name,
      object_story_spec: {
        page_id: data.pageId,
        ...(data.instagramUserId && { instagram_user_id: data.instagramUserId }),
        link_data: {
          image_hash: data.imageHash,
          link: data.link,
          message: data.message,
          name: data.headline,
          ...(data.description && { description: data.description }),
          call_to_action: {
            type: data.callToAction || 'LEARN_MORE'
          }
        }
      }
    };

    console.log('Creating ad creative:', {
      adAccountId: formattedId,
      name: creativeData.name,
      pageId: data.pageId,
    });

    const response = await metaApi.post(
      `/${formattedId}/adcreatives`,
      creativeData,
      {
        params: { access_token: accessToken }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating ad creative:', error.response?.data || error);
    throw error;
  }
}

/**
 * Complete workflow: Upload image + Create creative
 */
export async function createCreativeWithImage(
  adAccountId: string,
  imageFile: File | Buffer,
  creativeDetails: {
    name: string;
    pageId: string;
    link: string;
    message: string;
    headline: string;
    description?: string;
    callToAction?: string;
    instagramUserId?: string;
  },
  accessToken: string
) {
  try {
    // Step 1: Upload image
    console.log('Step 1: Uploading image...');
    const { hash: imageHash } = await uploadAdImage(adAccountId, imageFile, accessToken);
    console.log('Image uploaded, hash:', imageHash);

    // Step 2: Create creative
    console.log('Step 2: Creating creative...');
    const creative = await createAdCreative(
      adAccountId,
      { ...creativeDetails, imageHash },
      accessToken
    );
    console.log('Creative created, ID:', creative.id);

    return creative;
  } catch (error) {
    console.error('Error in createCreativeWithImage workflow:', error);
    throw error;
  }
}
```

### Suggested API Endpoint: `/app/api/creatives/route.ts`

```typescript
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { uploadAdImage, createAdCreative, createCreativeWithImage } from '@/lib/meta-api';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const adAccountId = formData.get('adAccountId') as string;
    const imageFile = formData.get('image') as File;
    const name = formData.get('name') as string;
    const pageId = formData.get('pageId') as string;
    const link = formData.get('link') as string;
    const message = formData.get('message') as string;
    const headline = formData.get('headline') as string;
    const description = formData.get('description') as string;
    const callToAction = formData.get('callToAction') as string;
    const instagramUserId = formData.get('instagramUserId') as string;

    // Validate required fields
    if (!adAccountId || !imageFile || !name || !pageId || !link || !message || !headline) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert File to Buffer for upload
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    // Create creative with image
    const creative = await createCreativeWithImage(
      adAccountId,
      buffer,
      { name, pageId, link, message, headline, description, callToAction, instagramUserId },
      session.accessToken
    );

    return Response.json({
      success: true,
      creative_id: creative.id,
      message: 'Creative created successfully'
    });

  } catch (error: any) {
    console.error('Error in POST /api/creatives:', error);
    return Response.json(
      {
        error: 'Failed to create creative',
        details: error.response?.data || error.message
      },
      { status: 500 }
    );
  }
}
```

### Implementation Roadmap

**Phase 1: Basic Creative Creation (Recommended Next Step)**
- [ ] Add `uploadAdImage()` function to `meta-api.ts`
- [ ] Add `createAdCreative()` function to `meta-api.ts`
- [ ] Create `/api/creatives` endpoint
- [ ] Update UI to allow image upload + creative details
- [ ] Test workflow: Upload → Create Creative → Get ID

**Phase 2: Integrated Ad Creation**
- [ ] Update ad creation UI to include creative creation
- [ ] Add "Create New Creative" option alongside "Use Existing Creative"
- [ ] Store creative IDs for reuse
- [ ] Add creative preview functionality

**Phase 3: Advanced Features**
- [ ] Multi-image upload (dynamic creatives)
- [ ] Video upload support
- [ ] Creative template library
- [ ] A/B testing creative variations
- [ ] Creative performance analytics

---

## Summary & Recommendations

### Key Takeaways

1. **Creatives MUST be created BEFORE ads** - The ad creation endpoint only accepts `creative_id`, not inline creative details.

2. **Two valid approaches exist:**
   - **API-first:** Create creative via `/adcreatives` endpoint (recommended for automation)
   - **UI-first:** Create in Ads Manager and reference ID (current Poppy approach)

3. **Complete workflow requires 4 API calls:**
   - Create Campaign → Create Ad Set → Create Creative → Create Ad

4. **Image/video assets must be uploaded first** to get hash/ID before creating creative.

5. **object_story_spec is the most flexible** creative format for programmatic creation.

### For Poppy Ads Manager

**Current State:** ✅ Working (Manual Creative Creation)
- Users create creatives in Meta Ads Manager
- Users paste creative_id into Poppy
- Poppy creates ad using that ID

**Recommended Enhancement:** 🚀 Add Programmatic Creative Creation
- Implement `uploadAdImage()` and `createAdCreative()` functions
- Add `/api/creatives` endpoint
- Update UI to support image upload + creative details
- Enable fully automated ad creation workflow

**Benefits of Enhancement:**
- Faster ad creation (no context switching to Ads Manager)
- Better user experience (single interface)
- Enables bulk ad creation
- Scalable for automation

**Implementation Complexity:** Medium
- ~200 lines of code
- Requires multipart/form-data handling for image upload
- Need to handle async workflow (upload → create → validate)

---

## References

- [Meta Marketing API v24.0 - Ad Creative Reference](https://developers.facebook.com/docs/marketing-api/reference/ad-creative/)
- [Meta Marketing API v24.0 - Ad Account Ad Creatives](https://developers.facebook.com/docs/marketing-api/reference/ad-account/adcreatives/)
- [Meta Marketing API v24.0 - Ad Object Reference](https://developers.facebook.com/docs/marketing-api/reference/adgroup/)
- [Meta Creative Best Practices](https://developers.facebook.com/docs/marketing-api/creative-best-practices)

---

**Document Version:** 1.0
**Last Updated:** November 10, 2025
**Prepared By:** Poppy Marketing & Consulting
**For:** Meta Marketing API v24.0 Integration
