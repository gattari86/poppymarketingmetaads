# Meta Ad Rules - Quick Reference Card

## Rule Structure Template

```json
{
  "name": "Rule Name",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "SCHEDULE",
    "filters": [...]
  },
  "execution_spec": {
    "execution_type": "PAUSE",
    "execution_options": [...]
  }
}
```

---

## Evaluation Types

| Type | Description |
|------|-------------|
| `SCHEDULE` | Time-based (DAILY, HOURLY, SEMI_HOURLY) |
| `TRIGGER` | Event-based (when metrics change) |

---

## Common Operators

| Operator | Symbol | Use |
|----------|--------|-----|
| `EQUAL` | = | Exact match |
| `NOT_EQUAL` | ≠ | Not equal |
| `GREATER_THAN` | > | Numeric greater |
| `LESS_THAN` | < | Numeric less |
| `IN` | ∈ | In list |
| `CONTAIN` | ⊂ | String contains |

---

## Execution Types (Quick List)

### Budget & Bidding
- `CHANGE_BID` - Adjust bid
- `CHANGE_BUDGET` - Adjust ad set budget
- `CHANGE_CAMPAIGN_BUDGET` - Adjust campaign budget
- `REBALANCE_BUDGET` - Redistribute budget

### Campaign Management
- `PAUSE` - Pause entity
- `UNPAUSE` - Resume entity
- `ROTATE` - Rotate ads
- `UPDATE_CREATIVE` - Change creative

### Audience
- `ADD_INTEREST_RELAXATION` - Broaden targeting
- `INCREASE_RADIUS` - Expand geo-targeting

### Notifications
- `NOTIFICATION` - Send alert only
- `PING_ENDPOINT` - Webhook notification

---

## Common Metrics

| Metric | Description |
|--------|-------------|
| `spend` | Amount spent |
| `impressions` | Total impressions |
| `clicks` | Total clicks |
| `cpc` | Cost per click |
| `cpm` | Cost per 1,000 impressions |
| `ctr` | Click-through rate |
| `frequency` | Avg impressions per person |
| `roas` | Return on ad spend |
| `cost_per_conversion` | Cost per conversion |

---

## Time Presets

```
today, yesterday
last_3d, last_7d, last_14d, last_28d, last_30d, last_90d
this_week_mon_today, last_week_mon_sun
this_month, last_month
this_quarter, last_quarter
this_year, last_year
lifetime
```

---

## Common Filter Patterns

### Entity Type Filter
```json
{
  "field": "entity_type",
  "operator": "EQUAL",
  "value": "AD" // or "ADSET", "CAMPAIGN"
}
```

### Time Window
```json
{
  "field": "time_preset",
  "operator": "EQUAL",
  "value": "last_7d"
}
```

### Minimum Impressions
```json
{
  "field": "impressions",
  "operator": "GREATER_THAN",
  "value": 1000
}
```

### High CPC
```json
{
  "field": "cpc",
  "operator": "GREATER_THAN",
  "value": 5
}
```

### Low ROAS
```json
{
  "field": "roas",
  "operator": "LESS_THAN",
  "value": 2
}
```

---

## Quick Examples

### 1. Pause High-CPC Ads
```json
{
  "name": "Pause CPC > $5",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "SCHEDULE",
    "filters": [
      {"field": "entity_type", "operator": "EQUAL", "value": "AD"},
      {"field": "cpc", "operator": "GREATER_THAN", "value": 5},
      {"field": "impressions", "operator": "GREATER_THAN", "value": 500}
    ]
  },
  "execution_spec": {
    "execution_type": "PAUSE"
  }
}
```

### 2. Increase Budget for High ROAS
```json
{
  "name": "Scale ROAS > 3",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "SCHEDULE",
    "filters": [
      {"field": "entity_type", "operator": "EQUAL", "value": "ADSET"},
      {"field": "roas", "operator": "GREATER_THAN", "value": 3},
      {"field": "spend", "operator": "GREATER_THAN", "value": 50}
    ]
  },
  "execution_spec": {
    "execution_type": "CHANGE_BUDGET",
    "execution_options": [
      {"field": "budget_change_percentage", "operator": "EQUAL", "value": 20}
    ]
  }
}
```

### 3. Alert on Budget Spend
```json
{
  "name": "Alert 80% budget",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "SCHEDULE",
    "filters": [
      {"field": "entity_type", "operator": "EQUAL", "value": "CAMPAIGN"},
      {"field": "spend", "operator": "GREATER_THAN", "value": 800}
    ]
  },
  "execution_spec": {
    "execution_type": "NOTIFICATION"
  }
}
```

---

## API Endpoints (v24)

**Create Rule:**
```
POST /act_{account_id}/adrules_library
```

**Get Rule:**
```
GET /{rule_id}
```

**Update Rule:**
```
POST /{rule_id}
```

**Delete Rule:**
```
DELETE /{rule_id}
```

**Execute Rule:**
```
POST /{rule_id}/execute
```

**Preview Rule:**
```
POST /{rule_id}/preview
```

---

## Best Practices Checklist

- ✅ Start with NOTIFICATION before PAUSE/CHANGE
- ✅ Set minimum impressions threshold (500-1000+)
- ✅ Use appropriate time_preset for your data
- ✅ Respect 50-conversion learning phase
- ✅ Test with preview before enabling
- ✅ Monitor rule history regularly
- ✅ Avoid conflicting rules
- ✅ Use incremental budget changes (10-20%)
- ✅ Combine multiple filter conditions
- ✅ Set realistic metric thresholds

---

## Trigger Types (for TRIGGER evaluation)

| Type | When It Fires |
|------|---------------|
| `STATS_CHANGE` | Metric value changes |
| `STATS_MILESTONE` | Threshold reached |
| `METADATA_CREATION` | New entity created |
| `METADATA_UPDATE` | Entity modified |
| `DELIVERY_INSIGHTS_CHANGE` | Delivery metric changes |

---

## Execution Option Fields

**Budget Changes:**
- `budget_amount` - New budget value
- `budget_change_percentage` - % increase/decrease

**Bid Changes:**
- `bid_amount` - New bid value
- `bid_change_percentage` - % increase/decrease

**Status Changes:**
- `status` - ACTIVE or PAUSED

---

## Error Prevention

**Rule won't trigger?**
1. Check status is ENABLED
2. Verify thresholds are met
3. Ensure sufficient data exists
4. Review time_preset window

**Rule triggers too often?**
1. Increase thresholds
2. Add more filter conditions
3. Change to SCHEDULE type
4. Implement cooldown

---

## Rule Status Values

- `ENABLED` - Active and running
- `DISABLED` - Inactive
- `DELETED` - Removed
- `HAS_ISSUES` - Error state (check disable_error_code)

---

## Python One-Liner Examples

**Create Rule:**
```python
rule = account.create_ad_rule(params={...})
```

**Execute Rule:**
```python
AdRule(rule_id).create_execute()
```

**Preview Rule:**
```python
preview = AdRule(rule_id).create_preview()
```

**Get History:**
```python
history = AdRule(rule_id).get_history()
```

---

**Quick Reference Version**: 1.0
**API Version**: Meta Marketing API v24.0
**For Full Documentation**: See META_AD_RULES_V24_COMPLETE_REFERENCE.md
