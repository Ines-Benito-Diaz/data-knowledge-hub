# Python for data work

> **Category:** Tool · **Tags:** `python`, `data`, `scripts` · **Difficulty:** Beginner  
> **Last updated:** 2026-11-20

## Overview

Python is useful for data exploration, repeatable transformations, automation and connecting services. Keep project environments isolated so dependencies are easy to reproduce.

## Create a project environment

```bash
python3 -m venv .venv
source .venv/bin/activate       # macOS / Linux
# .venv\Scripts\activate       # Windows PowerShell
python -m pip install --upgrade pip
```

Record direct dependencies in a project file and document the Python version needed by the project.

## A small data task

```python
from pathlib import Path
import csv

source = Path("data/input.csv")
with source.open(newline="", encoding="utf-8") as handle:
    rows = list(csv.DictReader(handle))

print(f"Loaded {len(rows)} records")
```

## Good habits

- Keep input, transformation and output steps explicit.
- Validate required columns and record counts before publishing results.
- Put reusable logic in functions and keep secrets outside source control.
- Capture dependencies and include a short run command in the project README.
