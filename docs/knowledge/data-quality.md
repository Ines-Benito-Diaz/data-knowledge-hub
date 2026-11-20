# Data quality checks

> **Category:** Knowledge · **Tags:** `data quality`, `validation`, `best practices` · **Difficulty:** Intermediate  
> **Last updated:** 2026-11-20

## Overview

Data quality checks turn assumptions about data into visible, repeatable expectations. Choose checks based on how the data is used and the impact of a failure.

## Practical checks

- **Completeness:** required fields are present; expected partitions or periods arrived.
- **Validity:** values follow documented types, ranges and allowed formats.
- **Uniqueness:** keys that should be unique do not have duplicates.
- **Consistency:** related fields and tables agree on shared rules.
- **Freshness:** the latest available data meets the consumer's expectation.
- **Volume:** row counts stay within a reasonable range or explainable change.

## Make checks actionable

For each check, document its owner, threshold, run point and response. Include enough context in failures to help diagnose the issue without exposing sensitive values. Track exceptions and review thresholds when source behavior changes.

## Related documentation

- [Data pipeline project starter](../projects/data-pipeline-starter.md)
