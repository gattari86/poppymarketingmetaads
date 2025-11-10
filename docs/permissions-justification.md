# Meta App Review - Permissions Justification

This document provides detailed justification for each permission scope requested by the Poppy Marketing Ads Manager application.

## Overview

Poppy Marketing Ads Manager is a professional ads management platform that helps Meta Business users create and manage advertising campaigns, ad sets, and ads through a unified dashboard. The scopes requested below are the minimum necessary to provide this core functionality while maintaining data security and user privacy.

---

## Requested Permissions

### 1. `ads_management`

**Status:** Required (Standard Access)

**Description:**
This scope allows the application to read and manage ad accounts, campaigns, ad sets, ads, and related advertising data.

**How It's Used:**

| Feature | Usage |
|---------|-------|
| View Campaigns | `GET /{ad_account_id}/campaigns` |
| Create Campaigns | `POST /{ad_account_id}/campaigns` |
| View Ad Sets | `GET /{campaign_id}/adsets` |
| Create Ad Sets | `POST /{campaign_id}/adsets` |
| View Ads | `GET /{adset_id}/ads` |
| Create Ads | `POST /{adset_id}/ads` |
| Automated Rules | `POST /{ad_account_id}/adrules_library` |

**Why It's Necessary:**
Without this permission, the application cannot access or manage any advertising assets. This is the core functionality of the platform.

**Data Minimization:**
- We only request fields necessary for display and management
- We do not request financial data, performance metrics, or PII
- All retrieved data is temporary and not stored permanently

**Security Measures:**
- Access tokens are kept in server-side sessions only
- API calls happen exclusively on the backend
- No advertising data is transmitted to the client unnecessarily
- All API responses are validated before use

---

### 2. `business_management`

**Status:** Required (Standard Access)

**Description:**
This scope allows the application to read business account information and access ad accounts associated with the business.

**How It's Used:**

| Feature | Usage |
|---------|-------|
| List Ad Accounts | `GET /me/adaccounts` |
| Account Selection | Enumerate available ad accounts for user |

**Why It's Necessary:**
Users need to authenticate and select which ad account to work with. Without this permission, the application cannot discover or access the user's ad accounts.

**Data Minimization:**
- We only retrieve: account ID, account name, currency, and status
- We do not retrieve: financial data, account history, or other accounts
- Information is used solely for UI display

**Security Measures:**
- Business information is not stored beyond the session
- Account selections are stored only in user's browser localStorage
- No business data is transmitted to external services

---

### 3. `pages_show_list`

**Status:** Requested (Standard Access)

**Description:**
This scope allows the application to view the list of pages associated with a Facebook business account.

**How It's Used:**
- Future feature: Page selection for ad campaign targeting
- Planned for Q1 2026 release

**Why It's Necessary:**
Users often want to run ads for specific Facebook pages they manage. This permission enables that functionality.

**Data Minimization:**
- Only retrieves page ID and name
- Does not retrieve page engagement data, followers, or content
- Used only for dropdown selection in campaign creation

**Security Measures:**
- Page information is not persisted
- No page data is stored in the database
- Information displayed only in management interface

---

### 4. `pages_read_engagement`

**Status:** Requested (Standard Access)

**Description:**
This scope allows the application to read engagement data (likes, comments, shares) from Facebook pages.

**How It's Used:**
- Future feature: Analytics dashboard showing page performance
- Planned for Q2 2026 release

**Why It's Necessary:**
Advanced users want to understand how their ads impact page engagement. This permission enables basic engagement analytics.

**Data Minimization:**
- Only retrieves aggregated engagement metrics
- Does not retrieve individual user data or comments
- Does not retrieve personal identifying information
- Displayed only in analytics dashboard

**Security Measures:**
- Engagement metrics are aggregated and anonymized
- No personal data is retrieved or stored
- Data is not shared with third parties
- Metrics are refreshed on-demand, not cached

---

## Data Handling Policy

### What We Collect
- User's Facebook Business identity (name, email)
- Ad account information (IDs, names, currency)
- Campaign, ad set, and ad data (as managed by user)
- Page information (IDs, names) - future feature
- Aggregated engagement metrics - future feature

### What We DON'T Collect
- Ad account financial data or spend information
- User passwords or security credentials
- Personal information of ad viewers or customers
- Behavioral tracking data
- Location data beyond what user provides

### Where Data Is Stored
- **Session Data:** In secure, server-side sessions (not in browser localStorage)
- **User Preferences:** In Subapace (non-sensitive only; no tokens or passwords)
- **Temporary Cache:** In-memory during request processing only
- **Logs:** Essential debugging logs only; no sensitive data included

### How Long We Keep Data
- **Session Data:** Deleted when user logs out
- **User Preferences:** Kept until user manually deletes account
- **API Responses:** Processed and discarded immediately
- **Logs:** Purged after 30 days

### Who Has Access
- **User:** Can view and manage their own data via the dashboard
- **Admin Team:** Can access logs for debugging purposes only
- **Third Parties:** Never shared without explicit user consent
- **Meta:** Only Meta's own data is shared with Meta's platform

---

## Compliance Commitments

✓ **GDPR Compliance**
- Users can request data deletion at `/data-deletion`
- Data is processed only with user's consent
- Data processing is transparent and documented

✓ **CCPA Compliance**
- Users have right to know what data is collected
- Users can request deletion of personal information
- No personal information is sold

✓ **Facebook Platform Policies**
- We comply with all Facebook Platform Policies
- We do not misuse user data
- We maintain transparent data practices

✓ **Data Security**
- All transmission is encrypted (HTTPS only)
- Tokens are not logged or exposed
- Access tokens expire and are refreshed securely
- Database connections are protected

---

## Permission Change Timeline

### Current Release (v1.0)
- ✓ `ads_management` - Live
- ✓ `business_management` - Live
- ✓ `pages_show_list` - Live
- ✓ `pages_read_engagement` - Live

### Future Releases
- **Q1 2026:** Pages management features launch
- **Q2 2026:** Analytics dashboard launches
- **Q3 2026:** Performance insights and recommendations

---

## Contact Information

For questions about how we handle permissions and data:

**Privacy & Data Questions:** support@poppymarketingandconsulting.com
**Business Inquiries:** info@poppymarketingandconsulting.com
**Data Deletion Requests:** /data-deletion page or support email

---

## Appendix: Permission Scope Reference

| Scope | Type | Usage | Necessity |
|-------|------|-------|-----------|
| `ads_management` | Standard | Create/manage ads | Required |
| `business_management` | Standard | Access ad accounts | Required |
| `pages_show_list` | Standard | List business pages | Required |
| `pages_read_engagement` | Standard | Read page metrics | Required |

---

**Document Version:** 1.0
**Last Updated:** 2025-11-10
**Next Review:** 2026-06-10
