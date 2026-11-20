# SQL query patterns

> **Category:** Tool · **Tags:** `sql`, `queries`, `analytics` · **Difficulty:** Beginner  
> **Last updated:** 2026-11-20

## Overview

Use SQL to select, combine, aggregate and validate structured data. Start with a small, explicit query and build it in readable stages.

## Filter and summarize

```sql
SELECT
  customer_id,
  COUNT(*) AS order_count,
  SUM(order_total) AS revenue
FROM analytics.orders
WHERE order_date >= DATE '2026-01-01'
GROUP BY customer_id
HAVING COUNT(*) > 1
ORDER BY revenue DESC;
```

## Join with care

```sql
SELECT o.order_id, c.customer_name, o.order_total
FROM analytics.orders AS o
LEFT JOIN analytics.customers AS c
  ON o.customer_id = c.customer_id;
```

Before using a join, check the key's uniqueness and whether unmatched records should remain. After joining, compare row counts and inspect nulls.

## Reusable query checks

- Select only the columns needed by the next step.
- Name aggregates clearly and qualify columns when tables overlap.
- Check duplicate keys before joining one-to-many data.
- Add a date filter early when it preserves the intended result.
