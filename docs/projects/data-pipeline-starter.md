# Data pipeline project starter

> **Category:** Project · **Tags:** `pipeline`, `etl`, `project setup` · **Difficulty:** Intermediate  
> **Last updated:** 2026-11-20

## Overview

This outline helps plan a small, dependable pipeline that moves data from a source to a useful output. Adapt the steps to the source, platform and service expectations.

## Define the contract

- Source owner, access method, refresh cadence and expected volume.
- Output users, schema, freshness expectation and retention needs.
- Sensitive fields, access controls and operational owner.

## Shape the workflow

1. **Extract:** retrieve a bounded, repeatable input and record its source window.
2. **Validate:** check required fields, types, keys and basic volume expectations.
3. **Transform:** apply documented business rules in reviewable stages.
4. **Publish:** write to a stable destination with a clear replacement or incremental strategy.
5. **Observe:** record run time, row counts, failures and freshness.

## Project checklist

- Make reruns safe and explain what happens after a partial failure.
- Keep credentials in an approved secret store, never in code or logs.
- Add a small known-good fixture for transformation checks.
- Document dependencies, configuration, run instructions and recovery steps.

## Related documentation

- [Python for data work](../tools/python.md)
- [SQL query patterns](../tools/sql.md)
- [Data quality checks](../knowledge/data-quality.md)
