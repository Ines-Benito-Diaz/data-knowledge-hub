# Python Polars Cheat Sheet
**Advanced Polars | Data Analytics | Data Engineering | Data Processing**

---

## 1. Polars Fundamentals

Polars is a high-performance DataFrame library for Python, designed for efficient data manipulation and analytical workloads.

### Import Polars

```python
import polars as pl
```

### Core concepts

| Concept | Description |
|---|---|
| DataFrame | Two-dimensional data structure |
| Series | One-dimensional column |
| Expression | Reusable declaration of a computation |
| LazyFrame | Deferred query execution |
| DataFrame | Eagerly evaluated data |
| Schema | Column names and data types |
| Query plan | Execution plan for a lazy query |

### Create a DataFrame

```python
df = pl.DataFrame({
    "customer_id": [1, 2, 3, 4],
    "country": ["Spain", "France", "Spain", "Germany"],
    "revenue": [1000, 2500, 1800, 3000],
    "active": [True, True, False, True]
})
```

### Create a Series

```python
revenue = pl.Series("revenue", [1000, 2500, 1800])
```

### Inspect a DataFrame

```python
df.head()
df.tail()
df.sample(5)

df.shape
df.columns
df.schema
df.dtypes

df.describe()
df.glimpse()
```

### Inspect schema

```python
df.schema
```

Example output:

```python
{
    "customer_id": pl.Int64,
    "country": pl.String,
    "revenue": pl.Int64,
    "active": pl.Boolean
}
```

---

## 2. Eager vs Lazy Execution

One of the most important differences in Polars.

### Eager execution

Operations are executed immediately.

```python
df = pl.read_csv("sales.csv")

result = df.filter(
    pl.col("revenue") > 1000
)
```

### Lazy execution

Operations are declared first and executed when `.collect()` is called.

```python
result = (
    pl.scan_csv("sales.csv")
    .filter(pl.col("revenue") > 1000)
    .group_by("country")
    .agg(
        pl.col("revenue").sum().alias("total_revenue")
    )
    .collect()
)
```

### Execution comparison

| Feature | Eager | Lazy |
|---|---|---|
| Execution | Immediate | Deferred |
| Optimization | Individual operations | Whole query plan |
| Memory efficiency | Depends on operations | Can optimize execution |
| Query optimization | Limited to individual operations | Predicate and projection pushdown, etc. |
| Best for | Small datasets and exploration | Larger pipelines and complex transformations |

### LazyFrame workflow

```python
query = (
    pl.scan_parquet("sales.parquet")
    .filter(pl.col("revenue") > 1000)
    .select(
        "customer_id",
        "country",
        "revenue"
    )
)

result = query.collect()
```

### Inspect query plans

```python
# Optimized query plan
query.explain()

# Unoptimized query plan
query.explain(optimized=False)
```

### Collect results

```python
result = query.collect()
```

### Streaming execution

For workloads that benefit from processing data in batches:

```python
result = query.collect(engine="streaming")
```

**Best practices:**
- Prefer LazyFrames for multi-step analytical pipelines.
- Use `scan_csv()` and `scan_parquet()` instead of eagerly loading files when possible.
- Use `.collect()` only when you need to materialize the result.
- Inspect query plans when performance matters.
- Streaming is not guaranteed to reduce memory usage for every query; execution depends on supported operations and the query plan.

---

## 3. Selecting & Renaming Columns

Polars uses expressions through `pl.col()`.

### Select columns

```python
df.select(
    "customer_id",
    "country",
    "revenue"
)
```

### Select using expressions

```python
df.select(
    pl.col("revenue"),
    pl.col("country")
)
```

### Select multiple columns

```python
df.select(
    pl.col("revenue", "country")
)
```

### Select by data type

```python
df.select(
    pl.col(pl.Int64)
)
```

### Select columns by pattern

```python
# Columns starting with sales
df.select(
    pl.col("^sales_.*$")
)

# Columns containing revenue
df.select(
    pl.col("*revenue*")
)
```

### Exclude columns

```python
df.select(
    pl.exclude("customer_id")
)
```

### Rename columns

```python
df.rename({
    "customer_id": "client_id",
    "revenue": "total_revenue"
})
```

### Rename all columns

```python
df.rename(
    lambda column: column.lower().replace(" ", "_")
)
```

---

## 4. Filtering Rows

### Basic filtering

```python
df.filter(
    pl.col("revenue") > 1000
)
```

### Multiple conditions

```python
df.filter(
    (pl.col("revenue") > 1000) &
    (pl.col("country") == "Spain")
)
```

### OR conditions

```python
df.filter(
    (pl.col("country") == "Spain") |
    (pl.col("country") == "France")
)
```

### IN filtering

```python
df.filter(
    pl.col("country").is_in(["Spain", "France"])
)
```

### NOT filtering

```python
df.filter(
    ~pl.col("country").is_in(["Spain", "France"])
)
```

### NULL filtering

```python
df.filter(
    pl.col("revenue").is_null()
)

df.filter(
    pl.col("revenue").is_not_null()
)
```

### String filtering

```python
df.filter(
    pl.col("country").str.contains("Spa")
)
```

### Between values

```python
df.filter(
    pl.col("revenue").is_between(1000, 3000)
)
```

### Filter using multiple columns

```python
df.filter(
    pl.all_horizontal(
        pl.col("revenue") > 1000,
        pl.col("active")
    )
)
```

**Important:** Use `&`, `|` and `~` for Boolean expressions. Always use parentheses around individual conditions.

---

## 5. Adding & Transforming Columns

### with_columns()

Adds or replaces columns without removing existing columns.

```python
df = df.with_columns(
    (pl.col("revenue") * 1.10).alias("revenue_adjusted")
)
```

### Add multiple columns

```python
df = df.with_columns(
    (pl.col("revenue") * 1.10).alias("revenue_adjusted"),
    (pl.col("revenue") * 0.20).alias("estimated_tax")
)
```

### Modify existing columns

```python
df = df.with_columns(
    pl.col("country").str.to_uppercase()
)
```

### Create conditional columns

```python
df = df.with_columns(
    pl.when(pl.col("revenue") >= 2000)
    .then(pl.lit("High"))
    .when(pl.col("revenue") >= 1000)
    .then(pl.lit("Medium"))
    .otherwise(pl.lit("Low"))
    .alias("revenue_category")
)
```

### Multiple conditions

```python
df = df.with_columns(
    pl.when(
        (pl.col("revenue") > 2000) &
        (pl.col("active"))
    )
    .then(pl.lit("High Active"))
    .otherwise(pl.lit("Other"))
    .alias("customer_segment")
)
```

### Drop columns

```python
df.drop("customer_id")

df.drop(
    "customer_id",
    "active"
)
```

### Replace values

```python
df.with_columns(
    pl.col("country").replace({
        "Spain": "ES",
        "France": "FR",
        "Germany": "DE"
    })
)
```

---

## 6. Expressions & Expression Composition

Expressions are the foundation of Polars.

They describe what should be calculated, rather than manually iterating through rows.

### Basic expression

```python
pl.col("revenue") * 1.10
```

### Alias

```python
pl.col("revenue").alias("total_revenue")
```

### Multiple expressions

```python
df.select(
    pl.col("revenue").sum().alias("total_revenue"),
    pl.col("revenue").mean().alias("average_revenue"),
    pl.col("revenue").max().alias("max_revenue")
)
```

### Expression composition

```python
revenue_expression = (
    pl.col("quantity") *
    pl.col("unit_price")
)

df.with_columns(
    revenue_expression.alias("revenue")
)
```

### Reusable expressions

```python
def calculate_revenue(quantity, price):
    return (
        pl.col(quantity) *
        pl.col(price)
    )

df.with_columns(
    calculate_revenue(
        "quantity",
        "unit_price"
    ).alias("revenue")
)
```

### Horizontal operations

Calculate across columns within the same row.

```python
df.with_columns(
    pl.sum_horizontal(
        "january",
        "february",
        "march"
    ).alias("quarter_revenue")
)
```

### Horizontal minimum and maximum

```python
df.with_columns(
    pl.max_horizontal(
        "value_1",
        "value_2",
        "value_3"
    ).alias("max_value")
)
```

**Key distinction:**

- Vertical operations work across rows within a column.
- Horizontal operations work across multiple columns within a row.

---

## 7. Aggregations & Grouping

### Basic aggregations

```python
df.select(
    pl.col("revenue").sum().alias("total_revenue"),
    pl.col("revenue").mean().alias("average_revenue"),
    pl.col("revenue").min().alias("minimum_revenue"),
    pl.col("revenue").max().alias("maximum_revenue"),
    pl.col("revenue").count().alias("record_count")
)
```

### Group by one column

```python
df.group_by("country").agg(
    pl.col("revenue").sum().alias("total_revenue")
)
```

### Group by multiple columns

```python
df.group_by(
    ["country", "revenue_category"]
).agg(
    pl.col("revenue").sum().alias("total_revenue"),
    pl.col("customer_id").n_unique().alias("unique_customers"),
    pl.len().alias("total_records")
)
```

### Multiple aggregation functions

```python
df.group_by("country").agg(
    pl.col("revenue").sum().alias("total_revenue"),
    pl.col("revenue").mean().alias("average_revenue"),
    pl.col("revenue").median().alias("median_revenue"),
    pl.col("revenue").std().alias("revenue_std"),
    pl.col("revenue").max().alias("max_revenue")
)
```

### Count records

```python
df.group_by("country").agg(
    pl.len().alias("record_count")
)
```

### Count unique values

```python
df.group_by("country").agg(
    pl.col("customer_id").n_unique().alias("unique_customers")
)
```

### Filter groups after aggregation

```python
df.group_by("country").agg(
    pl.col("revenue").sum().alias("total_revenue")
).filter(
    pl.col("total_revenue") > 5000
)
```

### Sort aggregation results

```python
df.group_by("country").agg(
    pl.col("revenue").sum().alias("total_revenue")
).sort(
    "total_revenue",
    descending=True
)
```

---

## 8. Sorting & Ranking

### Sort ascending

```python
df.sort("revenue")
```

### Sort descending

```python
df.sort(
    "revenue",
    descending=True
)
```

### Sort by multiple columns

```python
df.sort(
    ["country", "revenue"],
    descending=[False, True]
)
```

### Rank values

```python
df.with_columns(
    pl.col("revenue")
    .rank(method="dense", descending=True)
    .alias("revenue_rank")
)
```

### Ranking methods

| Method | Description |
|---|---|
| `average` | Average rank for ties |
| `min` | Minimum rank for ties |
| `max` | Maximum rank for ties |
| `dense` | Consecutive ranking without gaps |
| `ordinal` | Unique ranking based on row order |
| `random` | Random ordering for ties |

### Top N records

```python
df.top_k(
    10,
    by="revenue"
)
```

### Bottom N records

```python
df.bottom_k(
    10,
    by="revenue"
)
```

### Sort and select top records

```python
df.sort(
    "revenue",
    descending=True
).head(10)
```

---

## 9. Joins & Combining DataFrames

### INNER JOIN

Returns matching records.

```python
result = sales.join(
    customers,
    on="customer_id",
    how="inner"
)
```

### LEFT JOIN

Returns all records from the left DataFrame.

```python
result = sales.join(
    customers,
    on="customer_id",
    how="left"
)
```

### FULL OUTER JOIN

Returns matching and non-matching records from both DataFrames.

```python
result = sales.join(
    customers,
    on="customer_id",
    how="full"
)
```

### RIGHT JOIN

```python
result = sales.join(
    customers,
    on="customer_id",
    how="right"
)
```

### CROSS JOIN

```python
result = products.join(
    countries,
    how="cross"
)
```

### Join using different column names

```python
result = sales.join(
    customers,
    left_on="client_id",
    right_on="customer_id",
    how="left"
)
```

### Join on multiple columns

```python
result = sales.join(
    targets,
    on=["country", "month"],
    how="left"
)
```

### Join validation

```python
result = sales.join(
    customers,
    on="customer_id",
    how="left",
    validate="m:1"
)
```

Common validation options:

- `1:1`: One-to-one.
- `1:m`: One-to-many.
- `m:1`: Many-to-one.
- `m:m`: Many-to-many.

### Join strategies

| Join | Purpose |
|---|---|
| `inner` | Matching records |
| `left` | All left records |
| `right` | All right records |
| `full` | All records from both sides |
| `semi` | Left records with a match |
| `anti` | Left records without a match |
| `cross` | All possible combinations |

### Semi JOIN

```python
result = sales.join(
    customers,
    on="customer_id",
    how="semi"
)
```

### Anti JOIN

```python
result = sales.join(
    customers,
    on="customer_id",
    how="anti"
)
```

### Concatenate DataFrames vertically

```python
result = pl.concat(
    [df_2025, df_2026],
    how="vertical"
)
```

### Concatenate horizontally

```python
result = pl.concat(
    [df_1, df_2],
    how="horizontal"
)
```

### Concatenate with different schemas

```python
result = pl.concat(
    [df_2025, df_2026],
    how="diagonal"
)
```

---

## 10. Window Functions & Over()

Window expressions calculate values across groups while preserving the original row structure.

### Group-level aggregation

```python
df.with_columns(
    pl.col("revenue")
    .sum()
    .over("country")
    .alias("country_revenue")
)
```

### Group average

```python
df.with_columns(
    pl.col("revenue")
    .mean()
    .over("country")
    .alias("average_country_revenue")
)
```

### Rank within groups

```python
df.with_columns(
    pl.col("revenue")
    .rank(method="dense", descending=True)
    .over("country")
    .alias("country_rank")
)
```

### Percentage of group total

```python
df.with_columns(
    (
        pl.col("revenue") /
        pl.col("revenue").sum().over("country")
    ).alias("revenue_percentage")
)
```

### Cumulative sum

```python
df.sort(
    ["customer_id", "date"]
).with_columns(
    pl.col("revenue")
    .cum_sum()
    .over("customer_id")
    .alias("cumulative_revenue")
)
```

### Previous row — shift

```python
df.sort("date").with_columns(
    pl.col("revenue")
    .shift(1)
    .alias("previous_revenue")
)
```

### Difference from previous row

```python
df.sort("date").with_columns(
    (
        pl.col("revenue") -
        pl.col("revenue").shift(1)
    ).alias("revenue_change")
)
```

### Percentage change

```python
df.sort("date").with_columns(
    (
        pl.col("revenue").pct_change()
    ).alias("revenue_pct_change")
)
```

### Rolling average

```python
df.sort("date").with_columns(
    pl.col("revenue")
    .rolling_mean(window_size=7)
    .alias("rolling_average_7")
)
```

**Important:** `over()` applies group-based calculations while retaining row-level output. It is particularly useful for ranking, cumulative metrics and group comparisons.

---

## 11. Handling NULL Values & Missing Data

Polars distinguishes between NULL values and floating-point NaN values.

### Detect NULL values

```python
df.filter(
    pl.col("revenue").is_null()
)
```

### Detect non-NULL values

```python
df.filter(
    pl.col("revenue").is_not_null()
)
```

### Count NULL values

```python
df.null_count()
```

### Replace NULL values

```python
df.with_columns(
    pl.col("revenue").fill_null(0)
)
```

### Forward fill

```python
df.with_columns(
    pl.col("revenue").fill_null(strategy="forward")
)
```

### Backward fill

```python
df.with_columns(
    pl.col("revenue").fill_null(strategy="backward")
)
```

### Fill with mean

```python
df.with_columns(
    pl.col("revenue").fill_null(
        pl.col("revenue").mean()
    )
)
```

### Drop NULL values

```python
df.drop_nulls()
```

### Drop NULL values in specific columns

```python
df.drop_nulls(
    subset=["customer_id", "revenue"]
)
```

### Handle NaN

```python
df.with_columns(
    pl.col("revenue").fill_nan(0)
)
```

### Detect NaN

```python
df.filter(
    pl.col("revenue").is_nan()
)
```

**Important:**
- NULL represents missing data.
- NaN is a floating-point value.
- `fill_null()` does not replace NaN.
- `fill_nan()` does not replace NULL.

---

## 12. String Manipulation

Polars provides string operations through the `.str` namespace.

### Common string transformations

```python
df.with_columns(
    pl.col("customer_name").str.to_lowercase()
)

df.with_columns(
    pl.col("customer_name").str.to_uppercase()
)

df.with_columns(
    pl.col("customer_name").str.strip_chars()
)
```

### Replace text

```python
df.with_columns(
    pl.col("email")
    .str.replace("@gmail.com", "@company.com")
)
```

### Replace all occurrences

```python
df.with_columns(
    pl.col("phone")
    .str.replace_all("-", "")
)
```

### Extract substring

```python
df.with_columns(
    pl.col("customer_name")
    .str.slice(0, 5)
)
```

### String length

```python
df.with_columns(
    pl.col("customer_name")
    .str.len_chars()
    .alias("name_length")
)
```

### Split strings

```python
df.with_columns(
    pl.col("full_name")
    .str.split(" ")
    .alias("name_parts")
)
```

### Extract with regular expressions

```python
df.with_columns(
    pl.col("email")
    .str.extract(r"@(.+)$", 1)
    .alias("email_domain")
)
```

### Check if string contains a pattern

```python
df.filter(
    pl.col("email").str.contains("@gmail.com")
)
```

---

## 13. Date & Time Operations

### Convert strings to dates

```python
df = df.with_columns(
    pl.col("date")
    .str.to_date("%Y-%m-%d")
)
```

### Convert strings to datetime

```python
df = df.with_columns(
    pl.col("timestamp")
    .str.to_datetime("%Y-%m-%d %H:%M:%S")
)
```

### Extract date components

```python
df.with_columns(
    pl.col("date").dt.year().alias("year"),
    pl.col("date").dt.month().alias("month"),
    pl.col("date").dt.day().alias("day"),
    pl.col("date").dt.weekday().alias("weekday")
)
```

### Extract quarter

```python
df.with_columns(
    pl.col("date").dt.quarter().alias("quarter")
)
```

### Start and end of month

```python
df.with_columns(
    pl.col("date").dt.month_start().alias("month_start"),
    pl.col("date").dt.month_end().alias("month_end")
)
```

### Truncate dates

```python
df.with_columns(
    pl.col("date").dt.truncate("1mo").alias("month")
)
```

Other useful intervals:
- `"1d"`: Day
- `"1w"`: Week
- `"1mo"`: Month
- `"1q"`: Quarter
- `"1y"`: Year
- `"1h"`: Hour

### Date differences

```python
df.with_columns(
    (pl.col("end_date") - pl.col("start_date"))
    .alias("duration")
)
```

### Extract duration in days

```python
df.with_columns(
    (pl.col("end_date") - pl.col("start_date"))
    .dt.total_days()
    .alias("duration_days")
)
```

### Date arithmetic

```python
df.with_columns(
    (pl.col("date") + pl.duration(days=7))
    .alias("date_plus_7_days")
)
```

### Filter date ranges

```python
df.filter(
    pl.col("date").is_between(
        pl.date(2026, 1, 1),
        pl.date(2026, 12, 31)
    )
)
```

### Group by month

```python
df.group_by(
    pl.col("date").dt.truncate("1mo")
).agg(
    pl.col("revenue").sum().alias("monthly_revenue")
).sort("date")
```

---

## 14. Data Types & Type Conversion

### Common Polars data types

| Data type | Description |
|---|---|
| `pl.Int8` | 8-bit integer |
| `pl.Int16` | 16-bit integer |
| `pl.Int32` | 32-bit integer |
| `pl.Int64` | 64-bit integer |
| `pl.UInt64` | Unsigned integer |
| `pl.Float32` | 32-bit floating point |
| `pl.Float64` | 64-bit floating point |
| `pl.Decimal` | Fixed-precision decimal |
| `pl.String` | Text |
| `pl.Boolean` | True / False |
| `pl.Date` | Date |
| `pl.Datetime` | Date and time |
| `pl.Time` | Time |
| `pl.Duration` | Time difference |
| `pl.List` | List values |
| `pl.Struct` | Nested structure |
| `pl.Categorical` | Categorical values |
| `pl.Enum` | Fixed set of categories |

### Cast column types

```python
df.with_columns(
    pl.col("customer_id").cast(pl.String),
    pl.col("revenue").cast(pl.Float64)
)
```

### Strict vs non-strict casting

```python
# Raises an error if conversion fails
df.with_columns(
    pl.col("revenue").cast(pl.Int64)
)

# Invalid values become NULL
df.with_columns(
    pl.col("revenue").cast(
        pl.Int64,
        strict=False
    )
)
```

### Convert to categorical

```python
df.with_columns(
    pl.col("country").cast(pl.Categorical)
)
```

### Inspect data types

```python
df.schema
df.dtypes
```

---

## 15. Pivoting & Reshaping Data

### Pivot

Convert unique values into columns.

```python
df.pivot(
    on="month",
    index="country",
    values="revenue",
    aggregate_function="sum"
)
```

### Unpivot

Convert columns into rows.

```python
df.unpivot(
    on=["january", "february", "march"],
    index="country",
    variable_name="month",
    value_name="revenue"
)
```

### Explode lists

Convert list elements into individual rows.

```python
df.explode("products")
```

### Struct manipulation

```python
df.unnest("customer_info")
```

### Horizontal concatenation

```python
pl.concat(
    [df1, df2],
    how="horizontal"
)
```

---

## 16. Reading & Writing Data

### CSV

```python
# Eager
df = pl.read_csv("sales.csv")

# Lazy
query = pl.scan_csv("sales.csv")
```

### Parquet

```python
# Eager
df = pl.read_parquet("sales.parquet")

# Lazy
query = pl.scan_parquet("sales.parquet")
```

### Excel

```python
df = pl.read_excel("sales.xlsx")
```

Excel support and available engines depend on the installed Polars version and optional dependencies.

### JSON

```python
df = pl.read_json("sales.json")
```

### NDJSON

```python
df = pl.read_ndjson("sales.ndjson")
```

### Write files

```python
df.write_csv("output.csv")

df.write_parquet("output.parquet")

df.write_json("output.json")

df.write_ndjson("output.ndjson")
```

### Write partitioned Parquet

```python
df.write_parquet(
    "output.parquet",
    compression="zstd"
)
```

### CSV configuration

```python
df.write_csv(
    "output.csv",
    separator=",",
    include_header=True
)
```

### Lazy scanning with selected columns

```python
query = (
    pl.scan_parquet("sales.parquet")
    .select(
        "customer_id",
        "date",
        "revenue"
    )
    .filter(
        pl.col("revenue") > 1000
    )
)
```

---

## 17. Python Integration & DataFrame Interoperability

### Convert Polars to Pandas

```python
pandas_df = df.to_pandas()
```

Requires Pandas and typically PyArrow for efficient conversion.

### Convert Pandas to Polars

```python
polars_df = pl.from_pandas(pandas_df)
```

### Convert to NumPy

```python
array = df["revenue"].to_numpy()
```

### Convert to dictionaries

```python
records = df.to_dicts()
```

### Convert to Python list

```python
revenue_list = df["revenue"].to_list()
```

### Convert to Arrow

```python
arrow_table = df.to_arrow()
```

### Convert from Arrow

```python
df = pl.from_arrow(arrow_table)
```

---

## 18. Data Quality & Validation

### Check duplicate records

```python
df.filter(
    pl.struct(["customer_id", "date"])
    .is_duplicated()
)
```

### Remove duplicates

```python
df.unique(
    subset=["customer_id"],
    keep="first"
)
```

### Keep latest record per customer

```python
df.sort("updated_at").unique(
    subset=["customer_id"],
    keep="last",
    maintain_order=True
)
```

For deterministic results, ensure the sorting columns uniquely identify the desired latest record.

### Check missing values

```python
df.null_count()
```

### Calculate missing value percentage

```python
df.select(
    (
        pl.col("revenue").is_null().mean() * 100
    ).alias("missing_percentage")
)
```

### Check unique values

```python
df.select(
    pl.col("country").n_unique()
)
```

### Check invalid records

```python
df.filter(
    (pl.col("revenue") < 0) |
    (pl.col("quantity") <= 0)
)
```

### Validate schema

```python
expected_schema = {
    "customer_id": pl.Int64,
    "country": pl.String,
    "revenue": pl.Float64
}

assert df.schema == expected_schema
```

### Data profiling

```python
profile = df.select(
    pl.len().alias("total_rows"),
    pl.col("revenue").null_count().alias("missing_revenue"),
    pl.col("revenue").mean().alias("average_revenue"),
    pl.col("revenue").min().alias("minimum_revenue"),
    pl.col("revenue").max().alias("maximum_revenue")
)
```

---

## 19. Advanced Analytical Patterns

### Customer-level aggregation

```python
customer_summary = (
    df.group_by("customer_id")
    .agg(
        pl.col("revenue").sum().alias("total_revenue"),
        pl.col("order_id").n_unique().alias("total_orders"),
        pl.col("date").min().alias("first_purchase"),
        pl.col("date").max().alias("last_purchase")
    )
)
```

### Monthly revenue analysis

```python
monthly_revenue = (
    df.group_by(
        pl.col("date").dt.truncate("1mo").alias("month")
    )
    .agg(
        pl.col("revenue").sum().alias("total_revenue")
    )
    .sort("month")
)
```

### Month-over-month growth

```python
monthly_revenue = monthly_revenue.with_columns(
    pl.col("total_revenue")
    .shift(1)
    .alias("previous_month_revenue")
).with_columns(
    (
        (
            pl.col("total_revenue") -
            pl.col("previous_month_revenue")
        ) /
        pl.col("previous_month_revenue")
    ).alias("growth_rate")
)
```

### Top 3 customers per country

```python
top_customers = (
    df.group_by(["country", "customer_id"])
    .agg(
        pl.col("revenue").sum().alias("total_revenue")
    )
    .with_columns(
        pl.col("total_revenue")
        .rank(method="ordinal", descending=True)
        .over("country")
        .alias("ranking")
    )
    .filter(
        pl.col("ranking") <= 3
    )
)
```

### Revenue contribution by country

```python
country_revenue = (
    df.group_by("country")
    .agg(
        pl.col("revenue").sum().alias("total_revenue")
    )
    .with_columns(
        (
            pl.col("total_revenue") /
            pl.col("total_revenue").sum()
        ).alias("revenue_percentage")
    )
)
```

### Identify inactive customers

```python
inactive_customers = (
    df.group_by("customer_id")
    .agg(
        pl.col("date").max().alias("last_purchase")
    )
    .filter(
        pl.col("last_purchase") <
        pl.lit(date_limit)
    )
)
```

### Cohort preparation

```python
customer_cohorts = (
    df.group_by("customer_id")
    .agg(
        pl.col("date").min().alias("first_purchase")
    )
    .with_columns(
        pl.col("first_purchase")
        .dt.truncate("1mo")
        .alias("cohort_month")
    )
)
```

### Data reconciliation

```python
reconciliation = pl.DataFrame({
    "source": ["Source", "Target"],
    "records": [source_df.height, target_df.height],
    "revenue": [
        source_df["revenue"].sum(),
        target_df["revenue"].sum()
    ]
})
```

---

## 20. Performance Optimization & Best Practices

### 1. Prefer LazyFrames for complex pipelines

```python
query = (
    pl.scan_parquet("sales.parquet")
    .filter(pl.col("revenue") > 1000)
    .select("customer_id", "revenue")
    .group_by("customer_id")
    .agg(pl.col("revenue").sum())
)
```

### 2. Use projection pushdown

Select only the columns required by the final result.

```python
pl.scan_parquet("sales.parquet").select(
    "customer_id",
    "revenue"
)
```

### 3. Use predicate pushdown

Filter data as early as possible.

```python
pl.scan_parquet("sales.parquet").filter(
    pl.col("revenue") > 1000
)
```

### 4. Avoid unnecessary Python loops

Avoid iterating over rows when native expressions can perform the same operation.

```python
# Prefer
df.with_columns(
    (pl.col("quantity") * pl.col("price")).alias("revenue")
)
```

### 5. Avoid unnecessary Python UDFs

Native Polars expressions are generally more optimizable and efficient.

Avoid using `map_elements()` for transformations that can be expressed with native Polars functions.

### 6. Use appropriate data types

Avoid storing numeric values as strings.

Use smaller integer types when the value range allows it.

### 7. Avoid unnecessary materialization

Do not call `.collect()` after every transformation in a lazy pipeline.

### 8. Filter before joining

Reduce the size of the input DataFrames when possible.

### 9. Use Parquet for analytical workloads

Parquet is a columnar format that supports efficient column selection and compression.

### 10. Avoid excessive DataFrame copies

Chain transformations where practical.

### 11. Reuse expressions

```python
revenue = pl.col("quantity") * pl.col("unit_price")

df.with_columns(
    revenue.alias("revenue"),
    (revenue * 0.20).alias("estimated_tax")
)
```

### 12. Benchmark actual execution

```python
import time

start = time.perf_counter()

result = query.collect()

elapsed = time.perf_counter() - start

print(f"Execution time: {elapsed:.3f} seconds")
```

**Important:** Compare equivalent workloads, including data types, query plans, execution engines and memory conditions.

---

## 21. Common Mistakes & Troubleshooting

| Mistake | Better approach |
|---|---|
| Using Python loops for row operations | Use native expressions |
| Calling `.collect()` repeatedly | Keep transformations lazy |
| Using `map_elements()` unnecessarily | Prefer native expressions |
| Confusing NULL and NaN | Handle them separately |
| Forgetting parentheses in filters | Wrap every Boolean condition |
| Using `select()` when you want to preserve all columns | Use `with_columns()` |
| Using `pl.col()` outside an expression context | Use it inside `select()`, `filter()`, etc. |
| Ignoring data types | Inspect `df.schema` |
| Joining without checking keys | Validate join cardinality |
| Removing duplicates without a sorting rule | Define which record to retain |
| Converting to Pandas unnecessarily | Keep processing in Polars |
| Assuming LazyFrames execute immediately | Call `.collect()` to execute |

### Common errors

**Schema mismatch**

```python
df.schema
```

Inspect the actual column types before applying transformations.

**Invalid cast**

```python
df.with_columns(
    pl.col("revenue").cast(
        pl.Float64,
        strict=False
    )
)
```

**Unexpected duplicates after JOIN**

```python
result = left.join(
    right,
    on="customer_id",
    how="left",
    validate="m:1"
)
```

**Unexpected NULL values**

```python
df.null_count()
```

Check whether missing values originate from the source or from transformations and joins.

---

## 22. Quick Reference — Essential Polars Functions

| Category | Functions | Purpose |
|---|---|---|
| DataFrame | `pl.DataFrame()`, `pl.Series()` | Create data structures |
| Reading | `read_csv()`, `scan_csv()` | Load CSV |
| Reading | `read_parquet()`, `scan_parquet()` | Load Parquet |
| Selection | `select()`, `exclude()` | Select columns |
| Transformation | `with_columns()`, `rename()` | Modify columns |
| Filtering | `filter()`, `is_in()`, `is_between()` | Filter rows |
| Aggregation | `sum()`, `mean()`, `median()`, `max()` | Aggregate values |
| Grouping | `group_by()`, `agg()` | Group and aggregate |
| Joining | `join()`, `pl.concat()` | Combine datasets |
| Sorting | `sort()`, `top_k()`, `bottom_k()` | Sort records |
| Window | `over()`, `shift()`, `rank()` | Group calculations |
| Cumulative | `cum_sum()`, `cum_max()` | Cumulative operations |
| Missing data | `is_null()`, `fill_null()`, `drop_nulls()` | Handle missing data |
| Strings | `.str.contains()`, `.str.replace()` | Text manipulation |
| Dates | `.dt.year()`, `.dt.month()`, `.dt.truncate()` | Date manipulation |
| Types | `cast()`, `schema`, `dtypes` | Data type management |
| Reshaping | `pivot()`, `unpivot()`, `explode()` | Reshape data |
| Execution | `collect()`, `explain()` | Execute and inspect queries |
| Output | `write_csv()`, `write_parquet()` | Export datasets |

---

## 23. Recommended Polars Workflow

A typical professional data processing pipeline:

1. **Read source data:** Use `scan_csv()` or `scan_parquet()` for lazy ingestion.
2. **Inspect schema:** Review columns, data types and data quality.
3. **Select relevant columns:** Avoid loading unnecessary data.
4. **Clean data:** Handle missing values, duplicates and invalid records.
5. **Transform data:** Apply expressions, conditional logic and type conversions.
6. **Combine datasets:** Join sources using validated relationships.
7. **Aggregate data:** Calculate business metrics and analytical summaries.
8. **Validate results:** Check row counts, totals and data integrity.
9. **Optimize execution:** Inspect query plans and benchmark performance.
10. **Export results:** Write to Parquet, CSV or another required destination.

---

## 24. Polars vs Pandas

| Feature | Polars | Pandas |
|---|---|---|
| Execution | Eager and lazy | Primarily eager |
| Engine | Rust-based | Python / NumPy-based |
| Performance | Highly optimized | Depends on operation |
| Parallelism | Multithreaded execution | Varies by operation |
| Query optimization | Lazy query optimizer | No comparable lazy optimizer |
| Expressions | Expression-based API | Column operations and indexing |
| Memory | Efficient columnar processing | Flexible in-memory structures |
| Ecosystem | Growing | Extensive and mature |
| Best use cases | Large-scale analytical pipelines | General data manipulation and ecosystem compatibility |

**Key principle:** Polars is particularly powerful when building efficient, composable data transformation pipelines. Its expression API and lazy execution model are the main concepts to master.

---

## 25. Official Documentation & Resources

| Resource | Purpose |
|---|---|
| [Polars Documentation](https://docs.pola.rs/) | Official documentation |
| [Python API Reference](https://docs.pola.rs/api/python/stable/reference/) | Function reference |
| [User Guide](https://docs.pola.rs/user-guide/) | Tutorials and concepts |
| [Lazy API](https://docs.pola.rs/user-guide/lazy/) | Lazy execution and optimization |
| [Expressions](https://docs.pola.rs/user-guide/expressions/) | Expression-based transformations |
| [Joins](https://docs.pola.rs/user-guide/transformations/joins/) | DataFrame joins |
| [GitHub Repository](https://github.com/pola-rs/polars) | Source code and releases |

---

**Core concepts to master:** Expressions, LazyFrames, query optimization, window functions, joins and native transformations. These are the foundations for using Polars effectively in professional data analytics and engineering workflows.