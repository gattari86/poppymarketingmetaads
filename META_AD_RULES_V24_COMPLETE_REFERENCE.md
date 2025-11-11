# Meta Marketing API v24 - Automated Rules Complete Reference

## Overview

This document provides a comprehensive reference for Meta Marketing API v24 automated rules (`adrules_library` endpoint). Information compiled from official Facebook Python Business SDK source code and Meta developer documentation.

---

## 1. Rule Structure

An automated rule consists of three main components:

```javascript
{
  "name": "Rule Name",
  "evaluation_spec": { /* When to evaluate */ },
  "execution_spec": { /* What action to take */ },
  "schedule_spec": { /* Optional: Advanced scheduling */ },
  "status": "ENABLED" // or DISABLED
}
```

### Core Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Name of the rule |
| `evaluation_spec` | object | Defines when the rule is evaluated |
| `execution_spec` | object | Defines what action to take |
| `schedule_spec` | object | Optional scheduling configuration |
| `status` | enum | Rule status: `ENABLED`, `DISABLED`, `DELETED`, `HAS_ISSUES` |
| `account_id` | string | Ad account ID |
| `id` | string | Rule ID |
| `created_by` | object | User who created the rule |
| `created_time` | timestamp | Creation timestamp |
| `updated_time` | timestamp | Last update timestamp |
| `disable_error_code` | integer | Error code if disabled |
| `ui_creation_source` | enum | Source where rule was created |

---

## 2. Evaluation Spec (evaluation_spec)

Defines **when** and **under what conditions** the rule is evaluated.

### Structure

```json
{
  "evaluation_type": "SCHEDULE" | "TRIGGER",
  "filters": [
    {
      "field": "metric_name",
      "operator": "GREATER_THAN",
      "value": 100
    }
  ],
  "trigger": {
    "field": "metric_name",
    "type": "STATS_CHANGE",
    "operator": "GREATER_THAN",
    "value": 10
  }
}
```

### Evaluation Types

| Type | Description |
|------|-------------|
| `SCHEDULE` | Time-based evaluation - runs on set intervals |
| `TRIGGER` | Event-based evaluation - runs when conditions change |

### Schedule Types (for SCHEDULE evaluation)

- `DAILY` - Runs once per day
- `HOURLY` - Runs every hour
- `SEMI_HOURLY` - Runs every 30 minutes
- `CUSTOM` - Advanced custom scheduling

---

## 3. Filters (evaluation_spec.filters)

Filters define the conditions that must be met for the rule to trigger.

### Filter Structure

```json
{
  "field": "spend",
  "operator": "GREATER_THAN",
  "value": 100
}
```

### Available Operators

| Operator | Description | Use Case |
|----------|-------------|----------|
| `EQUAL` | Equals | Exact match |
| `NOT_EQUAL` | Not equal | Exclusion |
| `GREATER_THAN` | Greater than | Numeric comparison (>) |
| `LESS_THAN` | Less than | Numeric comparison (<) |
| `IN` | In set | Value is in list |
| `NOT_IN` | Not in set | Value not in list |
| `IN_RANGE` | In range | Value between min and max |
| `NOT_IN_RANGE` | Not in range | Value outside range |
| `CONTAIN` | Contains | String contains substring |
| `NOT_CONTAIN` | Not contain | String doesn't contain substring |
| `ALL` | All conditions | Logical AND |
| `ANY` | Any condition | Logical OR |
| `NONE` | No conditions | Logical NOT |

### Common Filter Fields

**Entity Fields:**
- `entity_type` - Type of entity (CAMPAIGN, ADSET, AD)
- `adset.id` - Specific ad set ID
- `campaign.id` - Specific campaign ID
- `ad.id` - Specific ad ID

**Time Fields:**
- `time_preset` - Predefined time ranges (see Time Presets section)
- `attribution_window` - Attribution window (7-day click, 1-day click, etc.)

**Performance Metrics:**
- `spend` - Amount spent
- `impressions` - Number of impressions
- `clicks` - Number of clicks
- `cpc` - Cost per click
- `cpm` - Cost per 1,000 impressions
- `ctr` - Click-through rate
- `frequency` - Average impressions per person
- `reach` - Number of unique people reached
- `cost_per_conversion` - Cost per conversion
- `roas` - Return on ad spend (ROAS)
- `cpa` - Cost per action/acquisition

### Time Presets

Available `time_preset` values:

- `today`
- `yesterday`
- `last_3d` - Last 3 days
- `last_7d` - Last 7 days
- `last_14d` - Last 14 days
- `last_28d` - Last 28 days
- `last_30d` - Last 30 days
- `last_90d` - Last 90 days
- `this_week_mon_today` - This week (Mon-Today)
- `this_week_sun_today` - This week (Sun-Today)
- `last_week_mon_sun` - Last week (Mon-Sun)
- `last_week_sun_sat` - Last week (Sun-Sat)
- `this_month` - Current month
- `last_month` - Previous month
- `this_quarter` - Current quarter
- `last_quarter` - Previous quarter
- `this_year` - Current year
- `last_year` - Previous year
- `lifetime` - All time

---

## 4. Trigger (evaluation_spec.trigger)

Defines what change triggers the rule (for TRIGGER evaluation type).

### Trigger Structure

```json
{
  "field": "cpc",
  "type": "STATS_CHANGE",
  "operator": "GREATER_THAN",
  "value": 10
}
```

### Trigger Types

| Type | Description |
|------|-------------|
| `STATS_CHANGE` | Statistical value changes (spend, CPC, impressions, etc.) |
| `STATS_MILESTONE` | Performance threshold reached |
| `METADATA_CREATION` | New metadata created |
| `METADATA_UPDATE` | Metadata modified |
| `DELIVERY_INSIGHTS_CHANGE` | Delivery metric changes |

### Trigger Operators

Same as Filter Operators (see section 3).

---

## 5. Execution Spec (execution_spec)

Defines **what action** to take when the rule conditions are met.

### Structure

```json
{
  "execution_type": "PAUSE",
  "execution_options": [
    {
      "field": "status",
      "operator": "EQUAL",
      "value": "PAUSED"
    }
  ]
}
```

### Execution Types (18 Available)

#### Budget & Bidding Actions

| Type | Description |
|------|-------------|
| `CHANGE_BID` | Modify bid amount |
| `CHANGE_BUDGET` | Adjust ad set budget |
| `CHANGE_CAMPAIGN_BUDGET` | Adjust campaign budget |
| `REBALANCE_BUDGET` | Redistribute budget across ad sets |
| `UPDATE_LAX_BUDGET` | Update flexible budget (LAX) |
| `UPDATE_LAX_DURATION` | Update flexible budget duration |

#### Campaign Management Actions

| Type | Description |
|------|-------------|
| `PAUSE` | Pause campaign/ad set/ad |
| `UNPAUSE` | Resume paused entity |
| `ROTATE` | Rotate ads within ad set |
| `UPDATE_CREATIVE` | Change ad creative |
| `DCO` | Dynamic Creative Optimization changes |

#### Audience Operations

| Type | Description |
|------|-------------|
| `ADD_INTEREST_RELAXATION` | Broaden interest targeting |
| `ADD_QUESTIONNAIRE_INTERESTS` | Add questionnaire-based interests |
| `AUDIENCE_CONSOLIDATION` | Merge audience segments |
| `AUDIENCE_CONSOLIDATION_ASK_FIRST` | Request approval before consolidating |
| `INCREASE_RADIUS` | Expand geographic targeting radius |

#### System Functions

| Type | Description |
|------|-------------|
| `NOTIFICATION` | Send notification only (no changes) |
| `PING_ENDPOINT` | Webhook notification to external endpoint |
| `AD_RECOMMENDATION_APPLY` | Apply Meta's ad recommendations |

### Execution Options

Execution options provide additional parameters for the action.

**Structure:**
```json
{
  "field": "budget_amount",
  "operator": "EQUAL",
  "value": 150
}
```

**Available Operators:**
- `EQUAL` - Set field to exact value
- `IN` - Set field to one of multiple values

### Common Execution Option Fields

For budget/bid changes:
- `budget_amount` - New budget amount
- `bid_amount` - New bid amount
- `budget_change_percentage` - % increase/decrease
- `bid_change_percentage` - % increase/decrease

For status changes:
- `status` - New status (ACTIVE, PAUSED)

---

## 6. Schedule Spec (schedule_spec)

Advanced scheduling configuration for SCHEDULE evaluation type.

```json
{
  "schedule_type": "DAILY",
  "start_time": "09:00",
  "end_time": "17:00",
  "timezone": "America/Los_Angeles"
}
```

**Schedule Types:**
- `DAILY`
- `HOURLY`
- `SEMI_HOURLY`
- `CUSTOM`

---

## 7. Complete Rule Examples

### Example 1: Pause High-CPC Ads

```json
{
  "name": "Pause ads with CPC > $5",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "SCHEDULE",
    "filters": [
      {
        "field": "entity_type",
        "operator": "EQUAL",
        "value": "AD"
      },
      {
        "field": "time_preset",
        "operator": "EQUAL",
        "value": "last_7d"
      },
      {
        "field": "cpc",
        "operator": "GREATER_THAN",
        "value": 5
      },
      {
        "field": "impressions",
        "operator": "GREATER_THAN",
        "value": 1000
      }
    ]
  },
  "execution_spec": {
    "execution_type": "PAUSE",
    "execution_options": [
      {
        "field": "status",
        "operator": "EQUAL",
        "value": "PAUSED"
      }
    ]
  }
}
```

### Example 2: Increase Budget for High ROAS

```json
{
  "name": "Increase budget by 20% when ROAS > 3",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "SCHEDULE",
    "filters": [
      {
        "field": "entity_type",
        "operator": "EQUAL",
        "value": "ADSET"
      },
      {
        "field": "time_preset",
        "operator": "EQUAL",
        "value": "today"
      },
      {
        "field": "roas",
        "operator": "GREATER_THAN",
        "value": 3
      },
      {
        "field": "spend",
        "operator": "GREATER_THAN",
        "value": 50
      }
    ]
  },
  "execution_spec": {
    "execution_type": "CHANGE_BUDGET",
    "execution_options": [
      {
        "field": "budget_change_percentage",
        "operator": "EQUAL",
        "value": 20
      }
    ]
  }
}
```

### Example 3: Trigger-Based CPC Monitoring

```json
{
  "name": "Alert when CPC increases by $2",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "TRIGGER",
    "trigger": {
      "field": "cpc",
      "type": "STATS_CHANGE",
      "operator": "GREATER_THAN",
      "value": 2
    },
    "filters": [
      {
        "field": "entity_type",
        "operator": "EQUAL",
        "value": "ADSET"
      },
      {
        "field": "impressions",
        "operator": "GREATER_THAN",
        "value": 500
      }
    ]
  },
  "execution_spec": {
    "execution_type": "NOTIFICATION"
  }
}
```

### Example 4: Pause Low-Performing Campaigns

```json
{
  "name": "Pause campaigns with high spend and low conversions",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "SCHEDULE",
    "filters": [
      {
        "field": "entity_type",
        "operator": "EQUAL",
        "value": "CAMPAIGN"
      },
      {
        "field": "time_preset",
        "operator": "EQUAL",
        "value": "last_3d"
      },
      {
        "field": "spend",
        "operator": "GREATER_THAN",
        "value": 200
      },
      {
        "field": "cost_per_conversion",
        "operator": "GREATER_THAN",
        "value": 50
      }
    ]
  },
  "execution_spec": {
    "execution_type": "PAUSE"
  }
}
```

---

## 8. API Operations

### Create Rule

```bash
POST https://graph.facebook.com/v24.0/act_{ad_account_id}/adrules_library

{
  "name": "Rule Name",
  "evaluation_spec": {...},
  "execution_spec": {...},
  "status": "ENABLED"
}
```

### Update Rule

```bash
POST https://graph.facebook.com/v24.0/{rule_id}

{
  "name": "Updated Name",
  "status": "DISABLED"
}
```

### Get Rule

```bash
GET https://graph.facebook.com/v24.0/{rule_id}
```

### Delete Rule

```bash
DELETE https://graph.facebook.com/v24.0/{rule_id}
```

### Execute Rule (Manual Trigger)

```bash
POST https://graph.facebook.com/v24.0/{rule_id}/execute
```

### Preview Rule (Test Without Executing)

```bash
POST https://graph.facebook.com/v24.0/{rule_id}/preview
```

### Get Rule History

```bash
GET https://graph.facebook.com/v24.0/{rule_id}/history
```

---

## 9. Best Practices (2025)

### Rule Configuration

1. **Start with NOTIFICATION rules** - Test conditions before taking automated actions
2. **Use meaningful thresholds** - Ensure sufficient data (e.g., min impressions) before triggering
3. **Implement safety nets** - Combine multiple conditions to prevent false triggers
4. **Avoid rule conflicts** - Ensure rules don't contradict each other
5. **Monitor the learning phase** - Don't trigger rules during the first 3-5 days (or before 50 conversions)

### Performance Optimization

1. **Respect the 50-conversion threshold** - Let ad sets exit learning phase before applying rules
2. **Use SCHEDULE type for regular checks** - More predictable than TRIGGER
3. **Batch similar rules** - Group related conditions for efficiency
4. **Test incrementally** - Use preview mode to test rule logic
5. **Monitor rule history** - Review what actions were taken and their impact

### Metrics Selection

1. **Prioritize primary KPIs** - Focus on ROAS, CPA, or conversion metrics over vanity metrics
2. **Use appropriate time windows** - Match time_preset to your conversion cycle
3. **Account for attribution windows** - Consider 7-day click vs 1-day click impact
4. **Set realistic thresholds** - Base values on historical performance data
5. **Consider seasonality** - Adjust rules for seasonal variations in performance

### Execution Types

1. **PAUSE is safer than DELETE** - You can resume paused campaigns
2. **Incremental budget changes** - Use percentages (10-20%) rather than doubling/halving
3. **Test NOTIFICATION first** - Validate rule logic before automating changes
4. **Use webhooks for critical alerts** - PING_ENDPOINT for immediate notifications
5. **Leverage Meta recommendations** - AD_RECOMMENDATION_APPLY for AI-driven improvements

### Meta v24 Specific Considerations

1. **Advantage+ compatibility** - Rules work with Advantage+ campaigns but respect AI optimization
2. **Placement optimization** - Rules apply after Meta's automatic placement distribution
3. **Creative quality focus** - Rules can't override creative performance - focus on data-driven triggers
4. **Event quality matters** - Ensure proper pixel/conversion API setup for accurate rule evaluation
5. **API version compatibility** - Some v24 features may not be available in legacy ASC/AAC campaigns

---

## 10. Available Metrics (70+ Fields)

### Core Performance Metrics

**Delivery:**
- `impressions` - Total impressions
- `reach` - Unique people reached
- `frequency` - Average impressions per person

**Engagement:**
- `clicks` - Total clicks
- `link_clicks` - Link clicks
- `ctr` - Click-through rate (%)
- `unique_clicks` - Unique clicks

**Cost Metrics:**
- `spend` - Amount spent
- `cpc` - Cost per click
- `cpm` - Cost per 1,000 impressions
- `cpp` - Cost per point (reach)

**Conversion Metrics:**
- `conversions` - Total conversions
- `conversion_rate` - Conversion rate (%)
- `cost_per_conversion` - Cost per conversion
- `roas` - Return on ad spend

**Video Metrics:**
- `video_views` - Video views
- `video_view_rate` - Video view rate
- `video_avg_time_watched` - Average watch time
- `video_p25_watched` - 25% completion rate
- `video_p50_watched` - 50% completion rate
- `video_p75_watched` - 75% completion rate
- `video_p100_watched` - 100% completion rate

**Engagement Metrics:**
- `post_engagement` - Post engagement
- `page_engagement` - Page engagement
- `post_reactions` - Reactions
- `post_comments` - Comments
- `post_shares` - Shares

### Account & Campaign Info

- `account_id` - Ad account ID
- `account_currency` - Account currency
- `campaign_id` - Campaign ID
- `campaign_name` - Campaign name
- `adset_id` - Ad set ID
- `adset_name` - Ad set name
- `ad_id` - Ad ID
- `ad_name` - Ad name

### Demographic Breakdowns

When using breakdowns:
- `age` - Age range
- `gender` - Gender
- `country` - Country
- `region` - Geographic region
- `device_platform` - Device type (mobile, desktop, etc.)
- `placement` - Ad placement

---

## 11. Common Error Scenarios

### Rule Disabled - Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 1 | Invalid filter configuration | Check filter field names and operators |
| 2 | Insufficient permissions | Verify account access level |
| 3 | Rule conflict detected | Review other active rules |
| 4 | Budget limit reached | Adjust account or campaign budget |
| 5 | Invalid execution type | Check execution_type enum value |

### Troubleshooting

**Rule not triggering:**
- Verify status is "ENABLED"
- Check filter thresholds are being met
- Ensure sufficient data exists (impressions, spend)
- Review time_preset matches evaluation period

**Rule triggering too often:**
- Increase thresholds
- Add additional filter conditions
- Change from TRIGGER to SCHEDULE
- Implement cooldown period

**Execution fails:**
- Verify account has sufficient budget
- Check campaign/ad set is active
- Ensure execution_type is valid for entity_type
- Review execution_options field names

---

## 12. Version Comparison (v23 vs v24)

### New in v24

1. **Advantage+ compatibility** - Better integration with Advantage+ campaigns
2. **Enhanced attribution support** - Improved time_preset handling
3. **Placement optimization** - Automatic placement distribution awareness
4. **Event quality signals** - Better optimization with improved pixel/conversion API data

### Deprecated in v24

1. **Legacy ASC/AAC APIs** - Must use v23 or earlier for legacy Advantage Shopping/App campaigns
2. **Some manual placement options** - Replaced by automatic optimization

### Unchanged

- Core rule structure (evaluation_spec, execution_spec)
- All execution types
- Filter and trigger operators
- Schedule types
- API endpoints

---

## 13. Python SDK Example

```python
from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
from facebook_business.adobjects.adrule import AdRule

# Initialize API
FacebookAdsApi.init(access_token='YOUR_ACCESS_TOKEN')

# Create rule
account = AdAccount('act_YOUR_ACCOUNT_ID')

rule_data = {
    'name': 'Pause High CPC Ads',
    'status': AdRule.Status.enabled,
    'evaluation_spec': {
        'evaluation_type': 'SCHEDULE',
        'filters': [
            {
                'field': 'entity_type',
                'operator': 'EQUAL',
                'value': 'AD'
            },
            {
                'field': 'cpc',
                'operator': 'GREATER_THAN',
                'value': 5
            }
        ]
    },
    'execution_spec': {
        'execution_type': 'PAUSE'
    }
}

# Create the rule
rule = account.create_ad_rule(params=rule_data)
print(f"Created rule: {rule['id']}")

# Get rule details
rule_obj = AdRule(rule['id'])
rule_obj.api_get(fields=['name', 'status', 'evaluation_spec', 'execution_spec'])

# Execute rule manually
rule_obj.create_execute()

# Preview rule without executing
preview = rule_obj.create_preview()
print(f"Would affect {len(preview)} entities")

# Get rule history
history = rule_obj.get_history()
for action in history:
    print(f"Action: {action['action']}, Time: {action['time']}")
```

---

## 14. JavaScript SDK Example

```javascript
const bizSdk = require('facebook-nodejs-business-sdk');

const AdAccount = bizSdk.AdAccount;
const AdRule = bizSdk.AdRule;

const access_token = 'YOUR_ACCESS_TOKEN';
const account_id = 'act_YOUR_ACCOUNT_ID';
const api = bizSdk.FacebookAdsApi.init(access_token);

// Create rule
const account = new AdAccount(account_id);

const ruleData = {
  name: 'Increase Budget for High ROAS',
  status: 'ENABLED',
  evaluation_spec: {
    evaluation_type: 'SCHEDULE',
    filters: [
      {
        field: 'entity_type',
        operator: 'EQUAL',
        value: 'ADSET'
      },
      {
        field: 'roas',
        operator: 'GREATER_THAN',
        value: 3
      }
    ]
  },
  execution_spec: {
    execution_type: 'CHANGE_BUDGET',
    execution_options: [
      {
        field: 'budget_change_percentage',
        operator: 'EQUAL',
        value: 20
      }
    ]
  }
};

// Create the rule
account.createAdRule([], ruleData)
  .then((result) => {
    console.log('Created rule:', result.id);

    // Get rule
    const rule = new AdRule(result.id);
    return rule.get(['name', 'status']);
  })
  .then((rule) => {
    console.log('Rule name:', rule.name);
    console.log('Rule status:', rule.status);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

---

## 15. Additional Resources

### Official Documentation

- **Meta Marketing API**: https://developers.facebook.com/docs/marketing-api/
- **Ad Rules Engine**: https://developers.facebook.com/docs/marketing-api/ad-rules/
- **API Reference**: https://developers.facebook.com/docs/marketing-api/reference/ad-rule/

### SDKs

- **Python**: https://github.com/facebook/facebook-python-business-sdk
- **JavaScript**: https://github.com/facebook/facebook-nodejs-business-sdk
- **PHP**: https://github.com/facebook/facebook-php-business-sdk

### Developer Support

- **Meta Business Help Center**: https://www.facebook.com/business/help
- **Developer Community**: https://developers.facebook.com/community/

---

## Document Information

**Version**: 1.0
**API Version**: Meta Marketing API v24.0
**Last Updated**: January 2025
**Source**: Official Facebook Python Business SDK + Meta Developer Documentation
**Compiled by**: Poppy Marketing & Consulting

---

**Note**: This is a comprehensive reference based on current API capabilities. Always refer to official Meta documentation for the most up-to-date information, as API features and capabilities may change with new versions.
