# Meta Ad Rules - Implementation Patterns & Real-World Examples

## Table of Contents

1. [Performance-Based Pausing Rules](#1-performance-based-pausing-rules)
2. [Budget Scaling Rules](#2-budget-scaling-rules)
3. [Alert & Notification Rules](#3-alert--notification-rules)
4. [Campaign Protection Rules](#4-campaign-protection-rules)
5. [Audience Optimization Rules](#5-audience-optimization-rules)
6. [Multi-Condition Complex Rules](#6-multi-condition-complex-rules)
7. [Time-Based Rules](#7-time-based-rules)
8. [Rule Chains & Sequences](#8-rule-chains--sequences)

---

## 1. Performance-Based Pausing Rules

### Pattern 1.1: Pause High-CPC Ads

**Use Case**: Stop ads that are too expensive per click

```json
{
  "name": "Pause ads with CPC > $5 after 1000 impressions",
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
        "value": 5.00
      },
      {
        "field": "impressions",
        "operator": "GREATER_THAN",
        "value": 1000
      }
    ]
  },
  "execution_spec": {
    "execution_type": "PAUSE"
  }
}
```

**Why it works**:
- Requires 1000+ impressions for statistical significance
- Targets specific cost threshold
- Can be easily adjusted per campaign goals

---

### Pattern 1.2: Pause Low-ROAS Ad Sets

**Use Case**: Stop ad sets with poor return on ad spend

```json
{
  "name": "Pause ad sets with ROAS < 2 and $100+ spend",
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
        "value": "last_14d"
      },
      {
        "field": "roas",
        "operator": "LESS_THAN",
        "value": 2.0
      },
      {
        "field": "spend",
        "operator": "GREATER_THAN",
        "value": 100
      }
    ]
  },
  "execution_spec": {
    "execution_type": "PAUSE"
  },
  "schedule_spec": {
    "schedule_type": "DAILY",
    "start_time": "09:00"
  }
}
```

**Best Practice**:
- Check daily at consistent time
- Requires meaningful spend before acting
- Uses 14-day window for e-commerce attribution

---

### Pattern 1.3: Pause High-Frequency Ads

**Use Case**: Prevent ad fatigue by stopping overexposed ads

```json
{
  "name": "Pause ads with frequency > 5 and decreasing CTR",
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
        "field": "frequency",
        "operator": "GREATER_THAN",
        "value": 5
      },
      {
        "field": "ctr",
        "operator": "LESS_THAN",
        "value": 1.0
      },
      {
        "field": "impressions",
        "operator": "GREATER_THAN",
        "value": 5000
      }
    ]
  },
  "execution_spec": {
    "execution_type": "PAUSE"
  }
}
```

---

## 2. Budget Scaling Rules

### Pattern 2.1: Increase Budget for High Performers

**Use Case**: Scale winning ad sets automatically

```json
{
  "name": "Increase budget 20% when ROAS > 3 and spend > 50% budget",
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
        "value": 3.0
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
  },
  "schedule_spec": {
    "schedule_type": "DAILY",
    "start_time": "18:00"
  }
}
```

**Strategy**:
- Checks daily at 6 PM when data is fresh
- Requires strong ROAS (3x)
- Incremental scaling (20%) to preserve performance

---

### Pattern 2.2: Decrease Budget for Poor Performers

**Use Case**: Reduce spend on underperforming campaigns

```json
{
  "name": "Decrease budget 30% when CPA > $50 for 3 days",
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
        "field": "cost_per_conversion",
        "operator": "GREATER_THAN",
        "value": 50
      },
      {
        "field": "conversions",
        "operator": "GREATER_THAN",
        "value": 10
      }
    ]
  },
  "execution_spec": {
    "execution_type": "CHANGE_CAMPAIGN_BUDGET",
    "execution_options": [
      {
        "field": "budget_change_percentage",
        "operator": "EQUAL",
        "value": -30
      }
    ]
  }
}
```

**Note**: Negative percentage for decrease

---

### Pattern 2.3: Budget Rebalancing

**Use Case**: Redistribute budget from weak to strong ad sets

```json
{
  "name": "Rebalance budget across campaign ad sets daily",
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
        "value": "today"
      },
      {
        "field": "spend",
        "operator": "GREATER_THAN",
        "value": 200
      }
    ]
  },
  "execution_spec": {
    "execution_type": "REBALANCE_BUDGET"
  },
  "schedule_spec": {
    "schedule_type": "DAILY",
    "start_time": "12:00"
  }
}
```

---

## 3. Alert & Notification Rules

### Pattern 3.1: Budget Burn Alert

**Use Case**: Get notified when approaching budget limit

```json
{
  "name": "Alert when 80% of daily budget spent by noon",
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
        "value": "today"
      },
      {
        "field": "spend",
        "operator": "GREATER_THAN",
        "value": 800
      }
    ]
  },
  "execution_spec": {
    "execution_type": "NOTIFICATION"
  },
  "schedule_spec": {
    "schedule_type": "CUSTOM",
    "start_time": "12:00"
  }
}
```

**Assumes**: $1000 daily budget

---

### Pattern 3.2: Performance Spike Alert

**Use Case**: Get notified of unusual positive performance

```json
{
  "name": "Alert when ROAS > 5 (potential winner)",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "TRIGGER",
    "trigger": {
      "field": "roas",
      "type": "STATS_MILESTONE",
      "operator": "GREATER_THAN",
      "value": 5
    },
    "filters": [
      {
        "field": "entity_type",
        "operator": "EQUAL",
        "value": "ADSET"
      },
      {
        "field": "spend",
        "operator": "GREATER_THAN",
        "value": 50
      }
    ]
  },
  "execution_spec": {
    "execution_type": "NOTIFICATION"
  }
}
```

**Benefit**: Immediate notification via trigger-based evaluation

---

### Pattern 3.3: Webhook Alert for Critical Issues

**Use Case**: Send data to external monitoring system

```json
{
  "name": "Webhook alert for campaign pauses",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "TRIGGER",
    "trigger": {
      "field": "status",
      "type": "METADATA_UPDATE",
      "operator": "EQUAL",
      "value": "PAUSED"
    },
    "filters": [
      {
        "field": "entity_type",
        "operator": "EQUAL",
        "value": "CAMPAIGN"
      }
    ]
  },
  "execution_spec": {
    "execution_type": "PING_ENDPOINT",
    "execution_options": [
      {
        "field": "endpoint_url",
        "operator": "EQUAL",
        "value": "https://your-webhook.com/meta-alerts"
      }
    ]
  }
}
```

---

## 4. Campaign Protection Rules

### Pattern 4.1: Learning Phase Protection

**Use Case**: Prevent changes during critical learning period

```json
{
  "name": "Alert if spend > $200 before 50 conversions",
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
        "value": "last_7d"
      },
      {
        "field": "conversions",
        "operator": "LESS_THAN",
        "value": 50
      },
      {
        "field": "spend",
        "operator": "GREATER_THAN",
        "value": 200
      }
    ]
  },
  "execution_spec": {
    "execution_type": "NOTIFICATION"
  }
}
```

**Purpose**: Flag ad sets that are spending without exiting learning phase

---

### Pattern 4.2: Minimum Performance Gate

**Use Case**: Pause campaigns that fail to meet baseline metrics

```json
{
  "name": "Pause campaigns with CTR < 0.5% after 10k impressions",
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
        "value": "last_7d"
      },
      {
        "field": "ctr",
        "operator": "LESS_THAN",
        "value": 0.5
      },
      {
        "field": "impressions",
        "operator": "GREATER_THAN",
        "value": 10000
      }
    ]
  },
  "execution_spec": {
    "execution_type": "PAUSE"
  }
}
```

---

### Pattern 4.3: Budget Safety Cap

**Use Case**: Hard stop when exceeding maximum spend

```json
{
  "name": "EMERGENCY: Pause campaign if spend > $5000 in 1 day",
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
        "value": "today"
      },
      {
        "field": "spend",
        "operator": "GREATER_THAN",
        "value": 5000
      }
    ]
  },
  "execution_spec": {
    "execution_type": "PAUSE"
  },
  "schedule_spec": {
    "schedule_type": "HOURLY"
  }
}
```

**Critical**: Checks every hour for safety

---

## 5. Audience Optimization Rules

### Pattern 5.1: Expand Targeting for Good Performance

**Use Case**: Broaden audience when hitting targets

```json
{
  "name": "Add interest relaxation when ROAS > 4 and reach plateaus",
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
        "value": "last_3d"
      },
      {
        "field": "roas",
        "operator": "GREATER_THAN",
        "value": 4
      },
      {
        "field": "reach",
        "operator": "LESS_THAN",
        "value": 50000
      }
    ]
  },
  "execution_spec": {
    "execution_type": "ADD_INTEREST_RELAXATION"
  }
}
```

---

### Pattern 5.2: Increase Geographic Radius

**Use Case**: Expand local targeting for lead gen

```json
{
  "name": "Increase radius when CPA < $30 and frequency > 3",
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
        "value": "last_7d"
      },
      {
        "field": "cost_per_conversion",
        "operator": "LESS_THAN",
        "value": 30
      },
      {
        "field": "frequency",
        "operator": "GREATER_THAN",
        "value": 3
      }
    ]
  },
  "execution_spec": {
    "execution_type": "INCREASE_RADIUS",
    "execution_options": [
      {
        "field": "radius_increase_miles",
        "operator": "EQUAL",
        "value": 5
      }
    ]
  }
}
```

---

## 6. Multi-Condition Complex Rules

### Pattern 6.1: Graduated Budget Scaling

**Use Case**: Different scaling % based on ROAS tiers

**Rule 1 - Moderate Performers:**
```json
{
  "name": "Scale +10% when ROAS 2-3",
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
        "field": "roas",
        "operator": "IN_RANGE",
        "value": [2, 3]
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
        "value": 10
      }
    ]
  }
}
```

**Rule 2 - Strong Performers:**
```json
{
  "name": "Scale +25% when ROAS > 3",
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
        "value": 25
      }
    ]
  }
}
```

---

### Pattern 6.2: Combined Metric Thresholds

**Use Case**: Multiple KPIs must be met

```json
{
  "name": "Pause if BOTH high CPC AND high CPA",
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
        "value": 3
      },
      {
        "field": "cost_per_conversion",
        "operator": "GREATER_THAN",
        "value": 40
      },
      {
        "field": "impressions",
        "operator": "GREATER_THAN",
        "value": 2000
      },
      {
        "field": "conversions",
        "operator": "GREATER_THAN",
        "value": 5
      }
    ]
  },
  "execution_spec": {
    "execution_type": "PAUSE"
  }
}
```

**Logic**: All filter conditions use implicit AND

---

## 7. Time-Based Rules

### Pattern 7.1: Weekend Pause

**Use Case**: Stop campaigns on specific days

```json
{
  "name": "Pause B2B campaigns Friday 6 PM",
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
        "field": "campaign.name",
        "operator": "CONTAIN",
        "value": "B2B"
      }
    ]
  },
  "execution_spec": {
    "execution_type": "PAUSE"
  },
  "schedule_spec": {
    "schedule_type": "CUSTOM",
    "day_of_week": "FRIDAY",
    "start_time": "18:00"
  }
}
```

---

### Pattern 7.2: Business Hours Optimization

**Use Case**: Adjust bids based on time of day

```json
{
  "name": "Increase bid 20% during business hours (9-5)",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "SCHEDULE",
    "filters": [
      {
        "field": "entity_type",
        "operator": "EQUAL",
        "value": "ADSET"
      }
    ]
  },
  "execution_spec": {
    "execution_type": "CHANGE_BID",
    "execution_options": [
      {
        "field": "bid_change_percentage",
        "operator": "EQUAL",
        "value": 20
      }
    ]
  },
  "schedule_spec": {
    "schedule_type": "CUSTOM",
    "start_time": "09:00",
    "end_time": "17:00"
  }
}
```

---

## 8. Rule Chains & Sequences

### Pattern 8.1: Progressive Budget Scaling

**Sequence**: Notification → Small Increase → Large Increase

**Step 1 - Alert:**
```json
{
  "name": "Alert: ROAS > 3 detected",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "TRIGGER",
    "trigger": {
      "field": "roas",
      "type": "STATS_MILESTONE",
      "operator": "GREATER_THAN",
      "value": 3
    }
  },
  "execution_spec": {
    "execution_type": "NOTIFICATION"
  }
}
```

**Step 2 - Small Scale (Day 1):**
```json
{
  "name": "Scale +15% if ROAS > 3 for 1 day",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "SCHEDULE",
    "filters": [
      {
        "field": "roas",
        "operator": "GREATER_THAN",
        "value": 3
      },
      {
        "field": "time_preset",
        "operator": "EQUAL",
        "value": "yesterday"
      }
    ]
  },
  "execution_spec": {
    "execution_type": "CHANGE_BUDGET",
    "execution_options": [
      {"field": "budget_change_percentage", "operator": "EQUAL", "value": 15}
    ]
  }
}
```

**Step 3 - Large Scale (Day 3):**
```json
{
  "name": "Scale +30% if ROAS > 3 for 3 days",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "SCHEDULE",
    "filters": [
      {
        "field": "roas",
        "operator": "GREATER_THAN",
        "value": 3
      },
      {
        "field": "time_preset",
        "operator": "EQUAL",
        "value": "last_3d"
      }
    ]
  },
  "execution_spec": {
    "execution_type": "CHANGE_BUDGET",
    "execution_options": [
      {"field": "budget_change_percentage", "operator": "EQUAL", "value": 30}
    ]
  }
}
```

---

### Pattern 8.2: Auto-Recover Paused Campaigns

**Use Case**: Resume campaigns that improve after pausing

**Rule 1 - Pause:**
```json
{
  "name": "Pause if CPA > $50",
  "status": "ENABLED",
  "evaluation_spec": {
    "evaluation_type": "SCHEDULE",
    "filters": [
      {"field": "cost_per_conversion", "operator": "GREATER_THAN", "value": 50}
    ]
  },
  "execution_spec": {
    "execution_type": "PAUSE"
  }
}
```

**Rule 2 - Resume (Manual after review):**
```json
{
  "name": "MANUAL: Resume if paused campaign has CPA < $40",
  "status": "DISABLED",
  "evaluation_spec": {
    "evaluation_type": "SCHEDULE",
    "filters": [
      {"field": "status", "operator": "EQUAL", "value": "PAUSED"},
      {"field": "cost_per_conversion", "operator": "LESS_THAN", "value": 40}
    ]
  },
  "execution_spec": {
    "execution_type": "UNPAUSE"
  }
}
```

**Note**: Keep resume rule DISABLED initially for safety

---

## Implementation Checklist

Before deploying rules:

- [ ] Start with NOTIFICATION rules to test logic
- [ ] Use `create_preview()` to see affected entities
- [ ] Set minimum impression/spend thresholds
- [ ] Ensure filter conditions don't conflict
- [ ] Test on non-critical campaigns first
- [ ] Monitor rule history daily for first week
- [ ] Document rule intent and thresholds
- [ ] Set up webhook alerts for critical rules
- [ ] Review and adjust thresholds monthly
- [ ] Archive or disable underperforming rules

---

## Common Mistakes to Avoid

1. **No minimum data threshold** - Triggers on insufficient data
2. **Conflicting rules** - Rules that cancel each other out
3. **Too aggressive scaling** - Budget increases > 50%
4. **Ignoring learning phase** - Rules active before 50 conversions
5. **No notifications first** - Going straight to PAUSE without testing
6. **Single metric focus** - Not considering context (impressions, spend)
7. **Wrong time preset** - Using "today" when "last_7d" is better
8. **Forgetting to enable** - Rule status left as DISABLED
9. **No rule documentation** - Forgetting why rules were created
10. **Set and forget** - Not monitoring rule performance

---

## Rule Testing Workflow

1. **Create as NOTIFICATION**
   - Test logic without making changes
   - Review what would be affected

2. **Use Preview Mode**
   ```python
   preview = rule.create_preview()
   print(f"Would affect {len(preview)} entities")
   ```

3. **Enable on Small Subset**
   - Add campaign ID filter
   - Test on 1-2 campaigns first

4. **Monitor for 3-7 Days**
   - Check rule history
   - Verify expected behavior
   - Adjust thresholds if needed

5. **Scale to All Campaigns**
   - Remove campaign ID filter
   - Set status to ENABLED
   - Continue monitoring

---

**Document Version**: 1.0
**Last Updated**: January 2025
**API Version**: Meta Marketing API v24.0
