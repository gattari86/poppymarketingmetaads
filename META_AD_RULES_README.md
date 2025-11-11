# Meta Marketing API v24 - Automated Rules Documentation

## Overview

This documentation suite provides comprehensive coverage of Meta Marketing API v24 automated rules capabilities, including technical specifications, implementation patterns, and real-world examples.

## Documentation Files

### 1. Complete Reference (21 KB)
**File**: `META_AD_RULES_V24_COMPLETE_REFERENCE.md`

**Contents**:
- Full API specification for v24
- All 18 execution types with descriptions
- Complete operator reference (12 operators)
- 70+ available metrics
- Evaluation types (SCHEDULE, TRIGGER)
- Time presets and attribution windows
- Python and JavaScript SDK examples
- API endpoints and operations
- Best practices for 2025
- Error handling and troubleshooting
- Version comparison (v23 vs v24)

**Use When**: You need definitive technical details, API structure, or complete field references.

---

### 2. Quick Reference Card (6 KB)
**File**: `META_AD_RULES_QUICK_REFERENCE.md`

**Contents**:
- One-page cheat sheet
- Rule structure template
- Common operators and metrics
- Time preset list
- Quick examples (3 patterns)
- API endpoint summary
- Best practices checklist
- Error prevention tips
- Python one-liners

**Use When**: You need quick lookup during implementation or a printable reference card.

---

### 3. Implementation Patterns (21 KB)
**File**: `META_AD_RULES_IMPLEMENTATION_PATTERNS.md`

**Contents**:
- 8 categories of real-world patterns
- 20+ complete rule examples
- Performance-based pausing rules
- Budget scaling strategies
- Alert and notification patterns
- Campaign protection rules
- Audience optimization rules
- Multi-condition complex rules
- Time-based rules
- Rule chains and sequences
- Implementation checklist
- Testing workflow
- Common mistakes to avoid

**Use When**: You're implementing specific use cases or need production-ready rule configurations.

---

## Quick Start Guide

### Step 1: Understand the Basics

Start with the **Quick Reference Card**:
```bash
open META_AD_RULES_QUICK_REFERENCE.md
```

Key concepts to grasp:
- **evaluation_spec**: When the rule runs (SCHEDULE or TRIGGER)
- **execution_spec**: What action to take (PAUSE, CHANGE_BUDGET, etc.)
- **filters**: Conditions that must be met
- **operators**: How to compare values (GREATER_THAN, EQUAL, etc.)

---

### Step 2: Review Complete Technical Details

Open the **Complete Reference** for API specifics:
```bash
open META_AD_RULES_V24_COMPLETE_REFERENCE.md
```

Focus on:
- Section 5: Execution Types (all 18 options)
- Section 3: Filter Operators
- Section 10: Available Metrics
- Section 7: Complete Rule Examples

---

### Step 3: Find Your Use Case

Browse **Implementation Patterns** for your scenario:
```bash
open META_AD_RULES_IMPLEMENTATION_PATTERNS.md
```

Common scenarios:
- **Need to pause high-cost ads?** → Pattern 1.1
- **Want to scale winners?** → Pattern 2.1
- **Need budget alerts?** → Pattern 3.1
- **Protect learning phase?** → Pattern 4.1
- **Expand targeting?** → Pattern 5.1

---

### Step 4: Test Before Deploying

Always start with NOTIFICATION:

```json
{
  "name": "TEST: Your rule name",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "SCHEDULE",
    "filters": [
      // Your conditions here
    ]
  },
  "execution_spec": {
    "execution_type": "NOTIFICATION"  // Start here!
  }
}
```

After validating:
1. Use `preview()` API to see affected entities
2. Change to actual execution type (PAUSE, CHANGE_BUDGET, etc.)
3. Test on 1-2 campaigns first
4. Monitor for 3-7 days
5. Scale to all campaigns

---

## Most Common Use Cases

### 1. Pause High-CPC Ads
```json
{
  "name": "Pause CPC > $5",
  "evaluation_spec": {
    "filters": [
      {"field": "cpc", "operator": "GREATER_THAN", "value": 5},
      {"field": "impressions", "operator": "GREATER_THAN", "value": 1000}
    ]
  },
  "execution_spec": {"execution_type": "PAUSE"}
}
```
**Reference**: Complete Reference → Section 7 Example 1

---

### 2. Scale High ROAS Ad Sets
```json
{
  "name": "Scale ROAS > 3 by 20%",
  "evaluation_spec": {
    "filters": [
      {"field": "roas", "operator": "GREATER_THAN", "value": 3},
      {"field": "spend", "operator": "GREATER_THAN", "value": 50}
    ]
  },
  "execution_spec": {
    "execution_type": "CHANGE_BUDGET",
    "execution_options": [
      {"field": "budget_change_percentage", "value": 20}
    ]
  }
}
```
**Reference**: Complete Reference → Section 7 Example 2

---

### 3. Budget Alerts
```json
{
  "name": "Alert: 80% budget spent",
  "evaluation_spec": {
    "filters": [
      {"field": "spend", "operator": "GREATER_THAN", "value": 800}
    ]
  },
  "execution_spec": {"execution_type": "NOTIFICATION"}
}
```
**Reference**: Implementation Patterns → Pattern 3.1

---

## API Quick Reference

### Create Rule
```bash
POST https://graph.facebook.com/v24.0/act_{account_id}/adrules_library
```

### Python Example
```python
from facebook_business.adobjects.adaccount import AdAccount

account = AdAccount('act_YOUR_ACCOUNT_ID')
rule = account.create_ad_rule(params={
    "name": "Rule Name",
    "evaluation_spec": {...},
    "execution_spec": {...},
    "status": "ENABLED"
})
```

### JavaScript Example
```javascript
const account = new AdAccount(account_id);
account.createAdRule([], ruleData)
  .then((result) => console.log(result.id));
```

**Full Examples**: Complete Reference → Section 13 (Python) & 14 (JavaScript)

---

## Key Technical Details

### Execution Types (18 Available)

**Budget & Bidding** (6):
- CHANGE_BID
- CHANGE_BUDGET
- CHANGE_CAMPAIGN_BUDGET
- REBALANCE_BUDGET
- UPDATE_LAX_BUDGET
- UPDATE_LAX_DURATION

**Campaign Management** (5):
- PAUSE
- UNPAUSE
- ROTATE
- UPDATE_CREATIVE
- DCO

**Audience Operations** (5):
- ADD_INTEREST_RELAXATION
- ADD_QUESTIONNAIRE_INTERESTS
- AUDIENCE_CONSOLIDATION
- AUDIENCE_CONSOLIDATION_ASK_FIRST
- INCREASE_RADIUS

**System Functions** (3):
- NOTIFICATION
- PING_ENDPOINT
- AD_RECOMMENDATION_APPLY

**Reference**: Complete Reference → Section 5

---

### Operators (12 Available)

| Operator | Use Case |
|----------|----------|
| EQUAL | Exact match |
| NOT_EQUAL | Exclusion |
| GREATER_THAN | Numeric > |
| LESS_THAN | Numeric < |
| IN | Value in list |
| NOT_IN | Value not in list |
| IN_RANGE | Between min/max |
| NOT_IN_RANGE | Outside range |
| CONTAIN | String contains |
| NOT_CONTAIN | String doesn't contain |
| ALL | Logical AND |
| ANY | Logical OR |

**Reference**: Complete Reference → Section 3

---

### Common Metrics

| Metric | Description |
|--------|-------------|
| spend | Amount spent |
| impressions | Total impressions |
| clicks | Total clicks |
| cpc | Cost per click |
| cpm | Cost per 1000 impressions |
| ctr | Click-through rate |
| roas | Return on ad spend |
| cost_per_conversion | Cost per conversion |
| frequency | Avg impressions per person |

**Full List**: Complete Reference → Section 10 (70+ metrics)

---

## Best Practices Summary

### Configuration
1. Start with NOTIFICATION rules (test logic)
2. Set minimum impression thresholds (500-1000+)
3. Use appropriate time_preset (match your conversion cycle)
4. Respect 50-conversion learning phase
5. Avoid rule conflicts

### Execution
1. Use preview mode before enabling
2. Test on 1-2 campaigns first
3. Monitor rule history daily (first week)
4. Incremental budget changes (10-20%)
5. Document rule intent and thresholds

### Optimization
1. Check rules match campaign objectives
2. Adjust thresholds based on performance data
3. Archive underperforming rules
4. Use webhooks for critical alerts
5. Review and update monthly

**Detailed Guide**: Complete Reference → Section 9

---

## Troubleshooting Guide

### Rule Not Triggering?

**Check**:
- [ ] Status is ENABLED
- [ ] Filter thresholds are being met
- [ ] Sufficient data exists (impressions, spend)
- [ ] time_preset matches evaluation period
- [ ] No conflicting rules

**Solution**: Create preview to see affected entities

---

### Rule Triggering Too Often?

**Fix**:
- Increase thresholds
- Add more filter conditions
- Change TRIGGER to SCHEDULE
- Implement minimum impression requirements

**Example**: Add `{"field": "impressions", "operator": "GREATER_THAN", "value": 1000}`

---

### Execution Fails?

**Verify**:
- [ ] Account has sufficient budget
- [ ] Campaign/ad set is ACTIVE
- [ ] execution_type valid for entity_type
- [ ] execution_options field names correct
- [ ] No account-level restrictions

**Reference**: Complete Reference → Section 11

---

## Advanced Topics

### Trigger Types (for TRIGGER evaluation)

| Type | When It Fires |
|------|---------------|
| STATS_CHANGE | Metric value changes |
| STATS_MILESTONE | Threshold reached |
| METADATA_CREATION | New entity created |
| METADATA_UPDATE | Entity modified |
| DELIVERY_INSIGHTS_CHANGE | Delivery metric changes |

**Details**: Complete Reference → Section 4

---

### Time Presets (17 Options)

Common:
- `today`, `yesterday`
- `last_7d`, `last_14d`, `last_28d`
- `this_month`, `last_month`
- `lifetime`

**Full List**: Complete Reference → Section 3

---

### Rule Chains

Create sequences for progressive optimization:

1. **Alert** → Notify when ROAS > 3
2. **Small Scale** → Increase 15% if sustained 1 day
3. **Large Scale** → Increase 30% if sustained 3 days

**Examples**: Implementation Patterns → Section 8

---

## SDK Integration

### Python
```python
from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
from facebook_business.adobjects.adrule import AdRule

# Initialize
FacebookAdsApi.init(access_token='YOUR_TOKEN')

# Create rule
account = AdAccount('act_ACCOUNT_ID')
rule = account.create_ad_rule(params=rule_data)

# Execute manually
AdRule(rule_id).create_execute()

# Preview
preview = AdRule(rule_id).create_preview()

# History
history = AdRule(rule_id).get_history()
```

**Full SDK Documentation**: Complete Reference → Section 13

---

### JavaScript/Node.js
```javascript
const bizSdk = require('facebook-nodejs-business-sdk');

const AdAccount = bizSdk.AdAccount;
const AdRule = bizSdk.AdRule;

// Create rule
const account = new AdAccount(account_id);
account.createAdRule([], ruleData)
  .then((result) => {
    console.log('Rule ID:', result.id);
  });

// Execute
const rule = new AdRule(rule_id);
rule.createExecute()
  .then((result) => console.log(result));
```

**Full SDK Documentation**: Complete Reference → Section 14

---

## What's New in v24

### New Features
1. Better Advantage+ campaign compatibility
2. Enhanced attribution window support
3. Automatic placement distribution awareness
4. Improved event quality signal processing

### Deprecated
1. Legacy ASC/AAC API support (use v23 for legacy campaigns)
2. Some manual placement options

### Unchanged
- Core rule structure
- All execution types
- Operators and filters
- API endpoints

**Details**: Complete Reference → Section 12

---

## Support Resources

### Official Documentation
- Meta Marketing API: https://developers.facebook.com/docs/marketing-api/
- Ad Rules Engine: https://developers.facebook.com/docs/marketing-api/ad-rules/
- API Reference: https://developers.facebook.com/docs/marketing-api/reference/ad-rule/

### SDKs
- Python: https://github.com/facebook/facebook-python-business-sdk
- JavaScript: https://github.com/facebook/facebook-nodejs-business-sdk
- PHP: https://github.com/facebook/facebook-php-business-sdk

### Help & Community
- Meta Business Help: https://www.facebook.com/business/help
- Developer Community: https://developers.facebook.com/community/

---

## Document Versions

| Document | Size | Version | Last Updated |
|----------|------|---------|--------------|
| Complete Reference | 21 KB | 1.0 | January 2025 |
| Quick Reference | 6 KB | 1.0 | January 2025 |
| Implementation Patterns | 21 KB | 1.0 | January 2025 |
| README (this file) | 8 KB | 1.0 | January 2025 |

---

## Navigation Guide

**I need to...**

- **Understand rule structure** → Quick Reference
- **Look up an operator or metric** → Complete Reference → Sections 3, 10
- **Find execution types** → Complete Reference → Section 5
- **See complete API examples** → Complete Reference → Sections 13-14
- **Copy a working rule** → Implementation Patterns
- **Pause high-cost ads** → Implementation Patterns → Pattern 1.1
- **Scale winners** → Implementation Patterns → Pattern 2.1
- **Set up alerts** → Implementation Patterns → Pattern 3.x
- **Protect learning phase** → Implementation Patterns → Pattern 4.1
- **Troubleshoot issues** → Complete Reference → Section 11
- **Learn best practices** → Complete Reference → Section 9
- **Compare v23 vs v24** → Complete Reference → Section 12

---

## Feedback & Updates

This documentation is compiled from:
- Official Facebook Python Business SDK source code
- Meta Marketing API v24 documentation
- Community best practices
- Real-world implementation patterns

For corrections or additions, please update the source files accordingly.

---

**Documentation Suite Maintained by**: Poppy Marketing & Consulting
**API Version**: Meta Marketing API v24.0
**Status**: Production Ready
**Last Review**: January 2025
