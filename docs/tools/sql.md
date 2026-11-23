# SQL Cheat Sheet
**Advanced SQL | Data Analytics | Data Engineering | BigQuery**

---

## 1. Query Structure & Execution Order

### Standard query structure

```sql
SELECT
    column_1,
    COUNT(*) AS total_records
FROM dataset.table_name
WHERE condition
GROUP BY column_1
HAVING COUNT(*) > 10
ORDER BY total_records DESC
LIMIT 100;
```

### Logical execution order

SQL clauses are written in one order but logically processed in another.

| Order | Clause | Purpose |
|---|---|---|
| 1 | FROM / JOIN | Retrieve and combine tables |
| 2 | WHERE | Filter individual rows |
| 3 | GROUP BY | Aggregate records |
| 4 | HAVING | Filter aggregated results |
| 5 | SELECT | Calculate and select columns |
| 6 | DISTINCT | Remove duplicate rows |
| 7 | ORDER BY | Sort results |
| 8 | LIMIT | Restrict output rows |

**Important:** This explains why aggregate functions cannot normally be used in `WHERE`, and why `HAVING` is used instead.

---

## 2. Advanced Filtering & Conditions

### Comparison operators

```sql
WHERE revenue > 1000
WHERE revenue >= 1000
WHERE revenue <> 0
WHERE status = 'ACTIVE'
WHERE country != 'Spain'
```

### Multiple conditions

```sql
WHERE country IN ('Spain', 'France', 'Germany')
  AND revenue BETWEEN 1000 AND 5000
  AND status NOT IN ('CANCELLED', 'PENDING');
```

### Pattern matching

```sql
-- Starts with
WHERE customer_name LIKE 'John%'

-- Ends with
WHERE customer_name LIKE '%son'

-- Contains
WHERE customer_name LIKE '%marketing%'

-- Regular expressions (BigQuery)
WHERE REGEXP_CONTAINS(email, r'@gmail\.com$')
```

### NULL handling

```sql
-- Identify missing values
WHERE column_name IS NULL

-- Exclude missing values
WHERE column_name IS NOT NULL

-- Replace NULL values
SELECT COALESCE(revenue, 0) AS revenue
FROM dataset.table_name;

-- Return alternative values
SELECT IFNULL(revenue, 0) AS revenue
FROM dataset.table_name;

-- Conditional NULL handling
SELECT
    NULLIF(revenue, 0) AS adjusted_revenue
FROM dataset.table_name;
```

**Key differences:**

- `COALESCE()`: Returns the first non-NULL value.
- `IFNULL()`: Replaces NULL with a specified value (BigQuery).
- `NULLIF()`: Returns NULL if two expressions are equal.

### Conditional logic — CASE WHEN

```sql
SELECT
    customer_id,
    revenue,
    CASE
        WHEN revenue >= 10000 THEN 'HIGH'
        WHEN revenue >= 5000 THEN 'MEDIUM'
        WHEN revenue > 0 THEN 'LOW'
        ELSE 'NO REVENUE'
    END AS revenue_category
FROM dataset.table_name;
```

### Conditional aggregation

```sql
SELECT
    country,
    COUNT(*) AS total_customers,
    COUNTIF(status = 'ACTIVE') AS active_customers,
    COUNTIF(status = 'INACTIVE') AS inactive_customers,
    SUM(IF(status = 'ACTIVE', revenue, 0)) AS active_revenue
FROM dataset.table_name
GROUP BY country;
```

`COUNTIF()` and `IF()` are particularly useful in BigQuery.

---

## 3. Aggregations & Analytical Calculations

### Aggregate functions

```sql
SELECT
    COUNT(*) AS total_records,
    COUNT(DISTINCT customer_id) AS unique_customers,
    SUM(revenue) AS total_revenue,
    AVG(revenue) AS average_revenue,
    MIN(revenue) AS min_revenue,
    MAX(revenue) AS max_revenue
FROM dataset.table_name;
```

### GROUP BY

```sql
SELECT
    country,
    campaign_type,
    COUNT(*) AS total_campaigns,
    SUM(spend) AS total_spend,
    AVG(spend) AS average_spend
FROM dataset.campaigns
GROUP BY country, campaign_type;
```

### HAVING

Filters groups after aggregation.

```sql
SELECT
    customer_id,
    SUM(revenue) AS total_revenue
FROM dataset.sales
GROUP BY customer_id
HAVING SUM(revenue) > 10000;
```

### GROUPING SETS

Calculate different aggregation levels in one query.

```sql
SELECT
    country,
    campaign_type,
    SUM(revenue) AS total_revenue
FROM dataset.campaigns
GROUP BY GROUPING SETS (
    (country, campaign_type),
    (country),
    ()
);
```

### ROLLUP

Generates hierarchical subtotals and a grand total.

```sql
SELECT
    country,
    campaign_type,
    SUM(revenue) AS total_revenue
FROM dataset.campaigns
GROUP BY ROLLUP(country, campaign_type);
```

### SAFE_DIVIDE — BigQuery

Avoid division-by-zero errors.

```sql
SELECT
    campaign_id,
    SAFE_DIVIDE(conversions, clicks) * 100 AS conversion_rate
FROM dataset.campaigns;
```

### Percentage contribution

```sql
SELECT
    campaign_id,
    revenue,
    SAFE_DIVIDE(
        revenue,
        SUM(revenue) OVER()
    ) * 100 AS revenue_percentage
FROM dataset.campaigns;
```

---

## 4. JOINs & Data Relationships

JOINs combine records from multiple tables using related columns.

### INNER JOIN

Returns only matching records.

```sql
SELECT
    c.customer_id,
    c.customer_name,
    o.order_id,
    o.order_date
FROM dataset.customers c
INNER JOIN dataset.orders o
    ON c.customer_id = o.customer_id;
```

### LEFT JOIN

Returns all records from the left table and matching records from the right table.

```sql
SELECT
    c.customer_id,
    c.customer_name,
    o.order_id
FROM dataset.customers c
LEFT JOIN dataset.orders o
    ON c.customer_id = o.customer_id;
```

### RIGHT JOIN

Returns all records from the right table.

```sql
SELECT *
FROM dataset.customers c
RIGHT JOIN dataset.orders o
    ON c.customer_id = o.customer_id;
```

### FULL OUTER JOIN

Returns matching and non-matching records from both tables.

```sql
SELECT *
FROM dataset.customers c
FULL OUTER JOIN dataset.orders o
    ON c.customer_id = o.customer_id;
```

### CROSS JOIN

Returns every possible combination of records.

```sql
SELECT
    c.customer_id,
    p.product_id
FROM dataset.customers c
CROSS JOIN dataset.products p;
```

### SELF JOIN

Joins a table to itself.

```sql
SELECT
    e.employee_name,
    m.employee_name AS manager_name
FROM dataset.employees e
LEFT JOIN dataset.employees m
    ON e.manager_id = m.employee_id;
```

### Anti JOIN — find unmatched records

```sql
SELECT
    c.customer_id
FROM dataset.customers c
LEFT JOIN dataset.orders o
    ON c.customer_id = o.customer_id
WHERE o.customer_id IS NULL;
```

### Semi JOIN — find matching records without duplicating the left table

```sql
SELECT *
FROM dataset.customers c
WHERE EXISTS (
    SELECT 1
    FROM dataset.orders o
    WHERE o.customer_id = c.customer_id
);
```

### JOIN best practices

- Always use explicit `JOIN` syntax instead of comma-separated tables.
- Use table aliases to improve readability.
- Check the cardinality of the relationship before joining.
- Avoid joining tables with unexpected duplicate keys.
- Filter data before joining when it reduces the amount of data processed.
- Be aware of one-to-many and many-to-many relationships.

---

## 5. Subqueries & Common Table Expressions (CTEs)

### Subqueries

A query nested inside another query.

```sql
SELECT *
FROM dataset.customers
WHERE customer_id IN (
    SELECT customer_id
    FROM dataset.orders
    WHERE order_status = 'COMPLETED'
);
```

### Scalar subqueries

Return a single value.

```sql
SELECT
    customer_id,
    revenue
FROM dataset.sales
WHERE revenue > (
    SELECT AVG(revenue)
    FROM dataset.sales
);
```

### Correlated subqueries

Reference columns from the outer query.

```sql
SELECT
    c.customer_id,
    c.customer_name
FROM dataset.customers c
WHERE EXISTS (
    SELECT 1
    FROM dataset.orders o
    WHERE o.customer_id = c.customer_id
      AND o.order_date >= DATE '2026-01-01'
);
```

### Common Table Expressions (CTEs)

CTEs create temporary named result sets within a query.

```sql
WITH customer_revenue AS (
    SELECT
        customer_id,
        SUM(revenue) AS total_revenue
    FROM dataset.sales
    GROUP BY customer_id
),

high_value_customers AS (
    SELECT *
    FROM customer_revenue
    WHERE total_revenue > 10000
)

SELECT *
FROM high_value_customers
ORDER BY total_revenue DESC;
```

### Multiple CTEs

Useful for breaking complex queries into logical steps.

```sql
WITH raw_data AS (
    SELECT *
    FROM dataset.sales
    WHERE order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 YEAR)
),

aggregated_data AS (
    SELECT
        customer_id,
        SUM(revenue) AS total_revenue,
        COUNT(*) AS total_orders
    FROM raw_data
    GROUP BY customer_id
),

final_data AS (
    SELECT
        *,
        SAFE_DIVIDE(total_revenue, total_orders) AS average_order_value
    FROM aggregated_data
)

SELECT *
FROM final_data;
```

### Recursive CTEs

Useful for hierarchical relationships, organizational structures and tree-like data.

```sql
WITH RECURSIVE employee_hierarchy AS (
    -- Anchor member
    SELECT
        employee_id,
        manager_id,
        employee_name,
        1 AS hierarchy_level
    FROM dataset.employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive member
    SELECT
        e.employee_id,
        e.manager_id,
        e.employee_name,
        h.hierarchy_level + 1
    FROM dataset.employees e
    INNER JOIN employee_hierarchy h
        ON e.manager_id = h.employee_id
)

SELECT *
FROM employee_hierarchy;
```

**Best practices:**

- Use CTEs to improve readability and maintainability.
- Give CTEs meaningful names.
- Avoid unnecessary nesting.
- Remember that a CTE is not automatically a materialized result or performance optimization.
- In BigQuery, a multiply referenced CTE may be evaluated more than once.

---

## 6. Window Functions

Window functions perform calculations across related rows without collapsing the result into a single row per group.

### Basic syntax

```sql
function_name() OVER (
    PARTITION BY column
    ORDER BY column
    ROWS BETWEEN ...
)
```

| Component | Purpose |
|---|---|
| PARTITION BY | Defines groups of rows |
| ORDER BY | Defines row ordering |
| ROWS / RANGE | Defines the window frame |

### Ranking functions

```sql
SELECT
    customer_id,
    revenue,

    ROW_NUMBER() OVER (
        ORDER BY revenue DESC
    ) AS row_num,

    RANK() OVER (
        ORDER BY revenue DESC
    ) AS revenue_rank,

    DENSE_RANK() OVER (
        ORDER BY revenue DESC
    ) AS dense_rank

FROM dataset.sales;
```

**Differences:**

- `ROW_NUMBER()`: Assigns a unique sequential number.
- `RANK()`: Assigns equal ranks to ties and skips subsequent ranks.
- `DENSE_RANK()`: Assigns equal ranks without skipping subsequent ranks.

### Ranking within groups

```sql
SELECT
    country,
    customer_id,
    revenue,
    ROW_NUMBER() OVER (
        PARTITION BY country
        ORDER BY revenue DESC
    ) AS country_rank
FROM dataset.sales;
```

### LAG and LEAD

Access previous or subsequent rows.

```sql
SELECT
    order_date,
    revenue,

    LAG(revenue, 1) OVER (
        ORDER BY order_date
    ) AS previous_revenue,

    LEAD(revenue, 1) OVER (
        ORDER BY order_date
    ) AS next_revenue

FROM dataset.daily_sales;
```

### Period-over-period comparison

```sql
WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC(order_date, MONTH) AS month,
        SUM(revenue) AS revenue
    FROM dataset.sales
    GROUP BY month
)

SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS previous_month,

    SAFE_DIVIDE(
        revenue - LAG(revenue) OVER (ORDER BY month),
        LAG(revenue) OVER (ORDER BY month)
    ) * 100 AS growth_percentage

FROM monthly_revenue;
```

### Running totals

```sql
SELECT
    order_date,
    revenue,

    SUM(revenue) OVER (
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_revenue

FROM dataset.daily_sales;
```

### Moving averages

```sql
SELECT
    order_date,
    revenue,

    AVG(revenue) OVER (
        ORDER BY order_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS moving_average_7_rows

FROM dataset.daily_sales;
```

Note: This calculates a seven-row moving average, not necessarily a seven-calendar-day average. Ensure the input has one row per day if that is the intended calculation.

### FIRST_VALUE and LAST_VALUE

```sql
SELECT
    customer_id,
    order_date,
    revenue,

    FIRST_VALUE(revenue) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) AS first_order_revenue,

    LAST_VALUE(revenue) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING
        AND UNBOUNDED FOLLOWING
    ) AS last_order_revenue

FROM dataset.orders;
```

### QUALIFY — BigQuery

Filter results after window functions without an additional subquery.

```sql
SELECT
    customer_id,
    order_id,
    revenue,

    ROW_NUMBER() OVER (
        PARTITION BY customer_id
        ORDER BY revenue DESC
    ) AS ranking

FROM dataset.orders

QUALIFY ranking = 1;
```

Useful for:
- Selecting the latest record per entity.
- Removing duplicates.
- Identifying top-performing records.
- Filtering ranked results.

---

## 7. Set Operations

Combine results from multiple SELECT statements.

### UNION ALL

Combines datasets and retains duplicates.

```sql
SELECT customer_id, revenue
FROM dataset.sales_2025

UNION ALL

SELECT customer_id, revenue
FROM dataset.sales_2026;
```

### UNION DISTINCT

Combines datasets and removes duplicate rows.

```sql
SELECT customer_id
FROM dataset.customers_2025

UNION DISTINCT

SELECT customer_id
FROM dataset.customers_2026;
```

### INTERSECT DISTINCT

Returns records present in both datasets.

```sql
SELECT customer_id
FROM dataset.customers_2025

INTERSECT DISTINCT

SELECT customer_id
FROM dataset.customers_2026;
```

### EXCEPT DISTINCT

Returns records from the first query that do not exist in the second.

```sql
SELECT customer_id
FROM dataset.customers_2025

EXCEPT DISTINCT

SELECT customer_id
FROM dataset.customers_2026;
```

**Important:** Queries combined using set operators must have compatible column counts and data types.

---

## 8. Date & Timestamp Functions

### Current date and time

```sql
SELECT
    CURRENT_DATE() AS today,
    CURRENT_TIMESTAMP() AS current_timestamp,
    CURRENT_DATETIME() AS current_datetime;
```

### Date extraction

```sql
SELECT
    EXTRACT(YEAR FROM order_date) AS year,
    EXTRACT(MONTH FROM order_date) AS month,
    EXTRACT(QUARTER FROM order_date) AS quarter,
    EXTRACT(DAY FROM order_date) AS day
FROM dataset.orders;
```

### Date arithmetic

```sql
-- Add days
DATE_ADD(order_date, INTERVAL 7 DAY)

-- Subtract months
DATE_SUB(order_date, INTERVAL 1 MONTH)

-- Difference between dates
DATE_DIFF(end_date, start_date, DAY)

-- First day of month
DATE_TRUNC(order_date, MONTH)

-- First day of year
DATE_TRUNC(order_date, YEAR)
```

### Date formatting

```sql
FORMAT_DATE('%Y-%m-%d', order_date)

FORMAT_DATE('%B %Y', order_date)
```

### String to date conversion

```sql
PARSE_DATE('%d/%m/%Y', '23/11/2026')
```

### Timestamp conversion

```sql
TIMESTAMP_TRUNC(event_timestamp, DAY)

TIMESTAMP_ADD(event_timestamp, INTERVAL 1 HOUR)

TIMESTAMP_DIFF(
    end_timestamp,
    start_timestamp,
    MINUTE
)
```

### Date filtering best practice

```sql
-- Prefer filtering directly on the date column
WHERE order_date >= DATE '2026-01-01'
  AND order_date < DATE '2026-02-01'
```

This is often more efficient than applying functions to the partitioning column.

---

## 9. String Manipulation & Data Transformation

### Common string functions

```sql
SELECT
    UPPER(customer_name) AS uppercase_name,
    LOWER(email) AS lowercase_email,
    TRIM(customer_name) AS clean_name,
    LENGTH(customer_name) AS name_length,
    CONCAT(first_name, ' ', last_name) AS full_name,
    SUBSTR(customer_name, 1, 5) AS short_name
FROM dataset.customers;
```

### Replace and split

```sql
-- Replace text
REPLACE(phone_number, '-', '')

-- Split strings
SPLIT(full_name, ' ')

-- Extract elements from arrays
SPLIT(full_name, ' ')[SAFE_OFFSET(0)]
```

### Regular expressions

```sql
-- Extract email domain
REGEXP_EXTRACT(email, r'@(.+)$')

-- Remove special characters
REGEXP_REPLACE(phone_number, r'[^0-9]', '')

-- Validate a basic email pattern
REGEXP_CONTAINS(email, r'^[^@]+@[^@]+\.[^@]+$')
```

### Type conversion

```sql
CAST(revenue AS STRING)

CAST(order_date AS STRING)

SAFE_CAST(revenue_string AS NUMERIC)

PARSE_NUMERIC(revenue_string)
```

`SAFE_CAST()` returns NULL instead of raising an error when conversion fails.

---

## 10. Arrays & STRUCTs — BigQuery

BigQuery supports nested and repeated data structures.

### Create an array

```sql
SELECT
    [10, 20, 30, 40] AS values_array;
```

### UNNEST

Convert array elements into individual rows.

```sql
SELECT
    customer_id,
    product
FROM dataset.customers,
UNNEST(products) AS product;
```

### Preserve records without array elements

```sql
SELECT
    customer_id,
    product
FROM dataset.customers
LEFT JOIN UNNEST(products) AS product
    ON TRUE;
```

### ARRAY_AGG

Aggregate rows into an array.

```sql
SELECT
    customer_id,
    ARRAY_AGG(product_name ORDER BY product_name) AS products
FROM dataset.orders
GROUP BY customer_id;
```

### STRUCT

Create nested records.

```sql
SELECT
    STRUCT(
        customer_id AS id,
        customer_name AS name,
        email AS email
    ) AS customer_info
FROM dataset.customers;
```

### ARRAY of STRUCTs

```sql
SELECT
    customer_id,
    ARRAY_AGG(
        STRUCT(
            order_id,
            order_date,
            revenue
        )
        ORDER BY order_date
    ) AS order_history
FROM dataset.orders
GROUP BY customer_id;
```

---

## 11. Data Manipulation Language (DML)

### INSERT

```sql
INSERT INTO dataset.customers (
    customer_id,
    customer_name,
    country
)
VALUES (
    101,
    'John Smith',
    'Spain'
);
```

### INSERT INTO SELECT

```sql
INSERT INTO dataset.archive
SELECT *
FROM dataset.sales
WHERE order_date < DATE '2025-01-01';
```

### UPDATE

```sql
UPDATE dataset.customers
SET
    status = 'INACTIVE',
    updated_at = CURRENT_TIMESTAMP()
WHERE last_purchase_date < DATE_SUB(
    CURRENT_DATE(),
    INTERVAL 1 YEAR
);
```

### DELETE

```sql
DELETE FROM dataset.customers
WHERE status = 'DELETED';
```

### MERGE

Combines INSERT, UPDATE and DELETE operations based on matching conditions.

Useful for incremental data loading and upsert processes.

```sql
MERGE dataset.target_table AS target
USING dataset.source_table AS source

ON target.customer_id = source.customer_id

WHEN MATCHED THEN
    UPDATE SET
        target.customer_name = source.customer_name,
        target.updated_at = CURRENT_TIMESTAMP()

WHEN NOT MATCHED THEN
    INSERT (
        customer_id,
        customer_name,
        updated_at
    )
    VALUES (
        source.customer_id,
        source.customer_name,
        CURRENT_TIMESTAMP()
    );
```

**Important:** Ensure the source contains no unexpected duplicate keys. Multiple source rows matching the same target row can cause BigQuery MERGE errors when an UPDATE or DELETE is performed.

---

## 12. DDL — Table & Schema Management

### CREATE TABLE

```sql
CREATE TABLE dataset.customers (
    customer_id INT64,
    customer_name STRING,
    email STRING,
    registration_date DATE,
    revenue NUMERIC
);
```

### CREATE TABLE AS SELECT (CTAS)

```sql
CREATE TABLE dataset.high_value_customers AS

SELECT
    customer_id,
    SUM(revenue) AS total_revenue
FROM dataset.sales
GROUP BY customer_id
HAVING SUM(revenue) > 10000;
```

### CREATE OR REPLACE TABLE

```sql
CREATE OR REPLACE TABLE dataset.customer_summary AS

SELECT
    customer_id,
    COUNT(*) AS total_orders,
    SUM(revenue) AS total_revenue
FROM dataset.sales
GROUP BY customer_id;
```

### CREATE TEMP TABLE

```sql
CREATE TEMP TABLE intermediate_results AS

SELECT *
FROM dataset.sales
WHERE revenue > 1000;
```

Temporary tables are useful for intermediate transformations within a script or session.

### ALTER TABLE

```sql
-- Add a column
ALTER TABLE dataset.customers
ADD COLUMN customer_segment STRING;

-- Rename a column
ALTER TABLE dataset.customers
RENAME COLUMN customer_segment TO segment;
```

### DROP TABLE

```sql
DROP TABLE IF EXISTS dataset.old_table;
```

---

## 13. Advanced Analytical Patterns

### Deduplication — Keep the latest record

```sql
SELECT *
FROM dataset.customer_events

QUALIFY ROW_NUMBER() OVER (
    PARTITION BY customer_id
    ORDER BY updated_at DESC, event_id DESC
) = 1;
```

Use a deterministic secondary ordering column to resolve ties.

### Top N records per group

```sql
SELECT *
FROM dataset.sales

QUALIFY RANK() OVER (
    PARTITION BY country
    ORDER BY revenue DESC
) <= 3;
```

### Identify missing dates

```sql
WITH calendar AS (
    SELECT calendar_date
    FROM UNNEST(
        GENERATE_DATE_ARRAY(
            DATE '2026-01-01',
            DATE '2026-01-31'
        )
    ) AS calendar_date
)

SELECT
    c.calendar_date
FROM calendar c
LEFT JOIN dataset.daily_sales s
    ON c.calendar_date = s.order_date
WHERE s.order_date IS NULL;
```

### Cohort analysis

Identify customers based on their first purchase month.

```sql
WITH customer_cohorts AS (
    SELECT
        customer_id,
        DATE_TRUNC(MIN(order_date), MONTH) AS cohort_month
    FROM dataset.orders
    GROUP BY customer_id
)

SELECT
    cohort_month,
    COUNT(DISTINCT customer_id) AS cohort_size
FROM customer_cohorts
GROUP BY cohort_month
ORDER BY cohort_month;
```

### Retention analysis

```sql
WITH customer_activity AS (
    SELECT DISTINCT
        customer_id,
        DATE_TRUNC(order_date, MONTH) AS activity_month
    FROM dataset.orders
),

cohorts AS (
    SELECT
        customer_id,
        MIN(activity_month) AS cohort_month
    FROM customer_activity
    GROUP BY customer_id
)

SELECT
    c.cohort_month,
    a.activity_month,
    DATE_DIFF(
        a.activity_month,
        c.cohort_month,
        MONTH
    ) AS months_since_first_purchase,
    COUNT(DISTINCT a.customer_id) AS active_customers

FROM customer_activity a
JOIN cohorts c
    ON a.customer_id = c.customer_id

GROUP BY
    c.cohort_month,
    a.activity_month,
    months_since_first_purchase

ORDER BY
    c.cohort_month,
    a.activity_month;
```

### Running percentage of total

```sql
SELECT
    campaign_id,
    revenue,

    SAFE_DIVIDE(
        SUM(revenue) OVER (
            ORDER BY revenue DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ),
        SUM(revenue) OVER()
    ) * 100 AS cumulative_percentage

FROM dataset.campaigns;
```

### Pivoting data

```sql
SELECT *
FROM (
    SELECT
        country,
        campaign_type,
        revenue
    FROM dataset.campaigns
)

PIVOT (
    SUM(revenue)
    FOR campaign_type IN (
        'SEARCH',
        'DISPLAY',
        'VIDEO'
    )
);
```

### Unpivoting data

```sql
SELECT *
FROM dataset.monthly_revenue

UNPIVOT (
    revenue FOR month IN (
        january,
        february,
        march
    )
);
```

---

## 14. BigQuery-Specific Features

### Fully qualified table names

```sql
project_id.dataset_id.table_name
```

### Table partitioning

Partition large tables by date or timestamp to reduce the amount of data scanned.

```sql
CREATE TABLE dataset.sales_partitioned
PARTITION BY DATE(order_timestamp)
AS

SELECT *
FROM dataset.raw_sales;
```

Common partitioning options:

- DATE column
- TIMESTAMP column
- DATETIME column
- Ingestion time (`_PARTITIONDATE` / `_PARTITIONTIME`)
- Integer range partitioning

### Clustered tables

Organize data based on frequently filtered or grouped columns.

```sql
CREATE TABLE dataset.sales_clustered
PARTITION BY order_date
CLUSTER BY customer_id, country
AS

SELECT *
FROM dataset.sales;
```

Clustering can improve query performance by reducing the data scanned for suitable filters.

### Partition filtering

```sql
SELECT *
FROM dataset.sales_partitioned
WHERE order_date >= DATE '2026-01-01'
  AND order_date < DATE '2026-02-01';
```

### INFORMATION_SCHEMA

Query metadata about datasets, tables and jobs.

```sql
-- List tables in a dataset
SELECT
    table_name,
    creation_time
FROM `project_id.dataset_id.INFORMATION_SCHEMA.TABLES`;
```

```sql
-- Inspect column definitions
SELECT
    column_name,
    data_type,
    is_nullable
FROM `project_id.dataset_id.INFORMATION_SCHEMA.COLUMNS`
WHERE table_name = 'customers';
```

```sql
-- Inspect recent query jobs
SELECT
    job_id,
    user_email,
    total_bytes_processed,
    total_slot_ms,
    creation_time
FROM `region-eu`.INFORMATION_SCHEMA.JOBS_BY_PROJECT
WHERE creation_time >= TIMESTAMP_SUB(
    CURRENT_TIMESTAMP(),
    INTERVAL 7 DAY
)
ORDER BY creation_time DESC;
```

The region qualifier must match the location where the jobs were executed.

### Approximate aggregations

Useful for large datasets when an approximate result is acceptable.

```sql
SELECT
    APPROX_COUNT_DISTINCT(customer_id) AS unique_customers
FROM dataset.sales;
```

Other functions:

```sql
APPROX_QUANTILES(revenue, 100)

APPROX_TOP_COUNT(product_id, 10)

APPROX_TOP_SUM(product_id, revenue, 10)
```

### BigQuery scripting

Execute multiple SQL statements in a single script.

```sql
DECLARE start_date DATE DEFAULT DATE '2026-01-01';

CREATE TEMP TABLE monthly_sales AS

SELECT
    customer_id,
    SUM(revenue) AS total_revenue
FROM dataset.sales
WHERE order_date >= start_date
GROUP BY customer_id;

SELECT *
FROM monthly_sales
ORDER BY total_revenue DESC;
```

### Dynamic SQL

Generate and execute SQL statements dynamically.

```sql
DECLARE table_name STRING DEFAULT 'sales';

EXECUTE IMMEDIATE FORMAT(
    'SELECT COUNT(*) FROM `project_id.dataset_id.%s`',
    table_name
);
```

Only use trusted or validated identifiers when constructing dynamic SQL.

---

## 15. Data Quality & Validation

### Check duplicate records

```sql
SELECT
    customer_id,
    COUNT(*) AS occurrences
FROM dataset.customers
GROUP BY customer_id
HAVING COUNT(*) > 1;
```

### Check NULL values

```sql
SELECT
    COUNT(*) AS total_records,
    COUNTIF(customer_id IS NULL) AS missing_customer_ids,
    COUNTIF(email IS NULL) AS missing_emails,
    COUNTIF(country IS NULL) AS missing_countries
FROM dataset.customers;
```

### Check referential integrity

Find records in a child table without a corresponding parent.

```sql
SELECT
    o.order_id,
    o.customer_id
FROM dataset.orders o
LEFT JOIN dataset.customers c
    ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;
```

### Check invalid values

```sql
SELECT *
FROM dataset.sales
WHERE revenue < 0
   OR quantity <= 0
   OR order_date > CURRENT_DATE();
```

### Compare source and target counts

```sql
SELECT
    (SELECT COUNT(*) FROM dataset.source_table) AS source_count,
    (SELECT COUNT(*) FROM dataset.target_table) AS target_count;
```

### Data reconciliation

```sql
SELECT
    'SOURCE' AS data_source,
    COUNT(*) AS records,
    SUM(revenue) AS total_revenue
FROM dataset.source_table

UNION ALL

SELECT
    'TARGET' AS data_source,
    COUNT(*) AS records,
    SUM(revenue) AS total_revenue
FROM dataset.target_table;
```

---

## 16. Query Optimization & Performance

### 1. Avoid SELECT *

Select only the columns you need.

```sql
-- Avoid
SELECT *
FROM dataset.sales;

-- Prefer
SELECT
    customer_id,
    order_date,
    revenue
FROM dataset.sales;
```

### 2. Filter early

Reduce the volume of data before performing expensive operations.

```sql
WITH filtered_sales AS (
    SELECT
        customer_id,
        order_date,
        revenue
    FROM dataset.sales
    WHERE order_date >= DATE '2026-01-01'
)

SELECT
    customer_id,
    SUM(revenue) AS total_revenue
FROM filtered_sales
GROUP BY customer_id;
```

### 3. Avoid unnecessary DISTINCT

`DISTINCT` can be expensive on large datasets. Understand why duplicates exist before removing them.

### 4. Avoid unnecessary transformations

Avoid applying functions to partition columns in filtering conditions when direct comparisons are possible.

### 5. Use approximate functions when appropriate

For large-scale exploratory analysis, approximate aggregations can reduce computational cost.

### 6. Avoid unnecessary JOINs

Only join tables and columns that contribute to the final result.

### 7. Watch out for data skew

Uneven distribution of values can create performance bottlenecks in distributed queries.

### 8. Avoid CROSS JOIN explosions

A CROSS JOIN between two large datasets can produce an enormous intermediate result.

### 9. Use partitioning and clustering

Design table structures around common query patterns.

### 10. Inspect query execution

In BigQuery, review:

- Bytes processed.
- Bytes billed.
- Slot milliseconds.
- Execution stages.
- Shuffle volume.
- Records read and written.
- Query execution time.

Use the BigQuery execution details and query plan to identify bottlenecks.

---

## 17. SQL Coding Standards & Best Practices

### Naming conventions

| Element | Recommended convention | Example |
|---|---|---|
| Tables | snake_case | `customer_orders` |
| Columns | snake_case | `order_date` |
| CTEs | Descriptive snake_case | `monthly_revenue` |
| Aliases | Short and meaningful | `c`, `o`, `sales` |
| Boolean columns | is_/has_ prefix | `is_active` |

### Query formatting

```sql
WITH filtered_campaigns AS (

    SELECT
        campaign_id,
        campaign_name,
        country,
        SUM(spend) AS total_spend,
        SUM(conversions) AS total_conversions

    FROM dataset.campaigns

    WHERE campaign_date >= DATE '2026-01-01'
      AND status = 'ACTIVE'

    GROUP BY
        campaign_id,
        campaign_name,
        country

)

SELECT
    campaign_id,
    campaign_name,
    country,
    total_spend,
    total_conversions,

    SAFE_DIVIDE(
        total_conversions,
        total_spend
    ) AS conversions_per_currency_unit

FROM filtered_campaigns

ORDER BY total_spend DESC;
```

### General best practices

- Use uppercase SQL keywords consistently.
- Use meaningful aliases and descriptive CTE names.
- Use explicit column lists instead of `SELECT *` in production queries.
- Avoid hardcoding values that should be parameters.
- Use comments to explain complex business logic.
- Use consistent date and timestamp conventions.
- Handle NULL values explicitly.
- Validate assumptions about primary keys and relationships.
- Use deterministic ordering when deduplicating.
- Keep transformations modular and reusable.
- Separate staging, transformation and reporting logic.
- Test edge cases, including NULLs, duplicates and empty datasets.
- Prefer readable queries over unnecessarily compact SQL.

---

## 18. Quick Reference — Functions & Operators

| Category | Functions / Operators | Purpose |
|---|---|---|
| Aggregation | `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()` | Aggregate data |
| Conditional | `CASE WHEN`, `IF()`, `COUNTIF()` | Conditional logic |
| NULL handling | `COALESCE()`, `IFNULL()`, `NULLIF()` | Handle missing values |
| Window | `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()` | Ranking |
| Window | `LAG()`, `LEAD()` | Previous / next rows |
| Window | `FIRST_VALUE()`, `LAST_VALUE()` | First / last values |
| Window | `SUM() OVER()`, `AVG() OVER()` | Analytical calculations |
| Date | `DATE_ADD()`, `DATE_SUB()`, `DATE_DIFF()` | Date arithmetic |
| Date | `DATE_TRUNC()`, `EXTRACT()` | Date transformation |
| String | `CONCAT()`, `TRIM()`, `UPPER()`, `LOWER()` | String manipulation |
| String | `REGEXP_CONTAINS()`, `REGEXP_EXTRACT()` | Pattern matching |
| Conversion | `CAST()`, `SAFE_CAST()` | Data type conversion |
| Arrays | `UNNEST()`, `ARRAY_AGG()` | Array manipulation |
| Analytical | `SAFE_DIVIDE()` | Safe division |
| Filtering | `IN`, `BETWEEN`, `EXISTS`, `LIKE` | Conditional filtering |
| Set operations | `UNION ALL`, `INTERSECT`, `EXCEPT` | Combine datasets |

---

## 19. SQL Concepts to Master

| Concept | What you should understand |
|---|---|
| Relational databases | Tables, relationships, keys and normalization |
| Query execution | Logical execution order and query plans |
| Cardinality | One-to-one, one-to-many and many-to-many relationships |
| Window functions | Partitioning, ordering and window frames |
| Data modeling | Fact tables, dimension tables and star schemas |
| Incremental loading | Processing only new or changed records |
| Deduplication | Identifying and retaining the correct record |
| Slowly Changing Dimensions | Tracking historical changes in dimension data |
| Partitioning | Organizing large tables by partition keys |
| Clustering | Improving data access through column organization |
| Data quality | Validation, reconciliation and integrity checks |
| Query optimization | Reducing scanned data and computational cost |

---

## 20. Recommended SQL Workflow

When developing a query for a real project, follow this process:

1. **Understand the data:** Identify the source tables, schemas, primary keys and relationships.
2. **Define the output:** Establish the expected grain, dimensions and metrics.
3. **Explore the source:** Check row counts, NULL values, duplicates and data ranges.
4. **Build incrementally:** Start with the source tables and progressively add filters, joins and transformations.
5. **Validate joins:** Check cardinality and ensure records are not unintentionally duplicated.
6. **Apply business logic:** Implement calculations, classifications and aggregation rules.
7. **Validate results:** Compare totals, test edge cases and reconcile source and target datasets.
8. **Optimize:** Review the execution plan, bytes scanned and query performance.
9. **Document:** Explain complex logic, assumptions and dependencies.
10. **Productionize:** Make the query reusable, maintainable and suitable for scheduled execution.

---

**Useful documentation:**

- [GoogleSQL Reference — BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax)
- [BigQuery Functions Reference](https://cloud.google.com/bigquery/docs/reference/standard-sql/functions-all)
- [BigQuery Performance Best Practices](https://cloud.google.com/bigquery/docs/best-practices-performance-overview)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/current/)
- [SQL Server Documentation](https://learn.microsoft.com/en-us/sql/)