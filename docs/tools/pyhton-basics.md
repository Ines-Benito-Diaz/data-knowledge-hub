# Python — Development Cheat Sheet

## 1. Python fundamentals

### Variables and data types

Python is dynamically typed, meaning you don't need to declare a variable's type explicitly.

```python
name = "John"          # String
age = 30               # Integer
price = 19.99          # Float
is_active = True       # Boolean
result = None          # NoneType
```

Check a variable's type:

```python
type(age)
```

Convert between types:

```python
str(123)       # Integer to string
int("123")     # String to integer
float("19.99") # String to float
```

### Strings

```python
first_name = "John"
last_name = "Smith"

# String formatting (recommended)
full_name = f"{first_name} {last_name}"

# Common operations
full_name.lower()
full_name.upper()
full_name.strip()
full_name.replace("John", "Jane")
full_name.split(" ")
```

### Operators

| Operator | Meaning | Example |
|---|---|---|
| `+` | Addition | `5 + 2` |
| `-` | Subtraction | `5 - 2` |
| `*` | Multiplication | `5 * 2` |
| `/` | Division | `5 / 2` |
| `//` | Floor division | `5 // 2` |
| `%` | Modulo (remainder) | `5 % 2` |
| `**` | Exponentiation | `5 ** 2` |
| `==` | Equal | `x == 5` |
| `!=` | Not equal | `x != 5` |
| `and` | Both conditions true | `x > 0 and x < 10` |
| `or` | At least one true | `x == 1 or x == 2` |
| `not` | Negation | `not is_active` |

---

## 2. Data structures

Python provides four fundamental data structures.

| Structure | Characteristics | Example |
|---|---|---|
| List | Ordered, mutable, allows duplicates | `[1, 2, 3]` |
| Tuple | Ordered, immutable | `(1, 2, 3)` |
| Dictionary | Key-value pairs, mutable | `{"name": "John"}` |
| Set | Unique elements, unordered | `{1, 2, 3}` |

### Lists

```python
numbers = [10, 20, 30, 40]

numbers.append(50)       # Add element
numbers.remove(20)       # Remove element
numbers[0]               # Access first element
numbers[-1]              # Access last element
numbers[1:3]             # Slice elements
len(numbers)             # Number of elements
sorted(numbers)          # Return sorted list
```

### Dictionaries

```python
person = {
    "name": "John",
    "age": 30,
    "city": "Madrid"
}

person["name"]               # Access value
person.get("email", None)    # Safe access with default
person["age"] = 31           # Update value
person.keys()                # Get keys
person.values()              # Get values
person.items()               # Get key-value pairs
```

### List comprehensions

A concise way to create lists from existing iterables.

```python
numbers = [1, 2, 3, 4, 5]

squares = [n ** 2 for n in numbers]

even_numbers = [n for n in numbers if n % 2 == 0]
```

**Good practice:** Use comprehensions for simple transformations. Use regular loops when the logic becomes complex.

---

## 3. Control flow

### Conditional statements

```python
score = 85

if score >= 90:
    result = "Excellent"
elif score >= 70:
    result = "Good"
else:
    result = "Needs improvement"
```

### Loops

**For loop:** Iterate over a collection.

```python
for name in ["John", "Jane", "Alex"]:
    print(name)
```

**While loop:** Repeat while a condition is true.

```python
counter = 0

while counter < 5:
    print(counter)
    counter += 1
```

### Useful loop functions

```python
# Access index and value
for index, value in enumerate(["A", "B", "C"]):
    print(index, value)

# Iterate over multiple collections
names = ["John", "Jane"]
ages = [30, 25]

for name, age in zip(names, ages):
    print(name, age)

# Exit a loop
break

# Skip current iteration
continue
```

---

## 4. Functions and modules

Functions allow you to reuse code and organize logic into smaller components.

### Define a function

```python
def calculate_total(price: float, quantity: int) -> float:
    return price * quantity

total = calculate_total(10.5, 3)
```

### Default parameters

```python
def greet(name: str, message: str = "Hello"):
    return f"{message}, {name}!"

greet("John")
greet("John", "Welcome")
```

### Lambda functions

Small anonymous functions, useful for simple operations.

```python
double = lambda x: x * 2

double(5)  # 10
```

For more complex logic, prefer a regular function.

### Import modules

Python modules allow you to reuse functionality from other files or libraries.

```python
import datetime
from pathlib import Path
import pandas as pd
```

Use aliases where they are widely established, such as `pd` for pandas and `np` for NumPy.

**Good practice:** Keep functions focused on one responsibility and avoid duplicating code.

---

## 5. Working with files and data

### File paths

Use `pathlib` to work with file paths across operating systems.

```python
from pathlib import Path

file_path = Path("data") / "input.csv"

if file_path.exists():
    print("File found")
```

### Read and write text files

```python
# Read
with open("input.txt", "r", encoding="utf-8") as file:
    content = file.read()

# Write
with open("output.txt", "w", encoding="utf-8") as file:
    file.write("Hello Python")
```

Using `with` automatically closes the file.

### JSON

JSON is commonly used for APIs and data exchange.

```python
import json

data = {"name": "John", "age": 30}

# Convert Python object to JSON
json_string = json.dumps(data, indent=4)

# Convert JSON to Python object
python_data = json.loads(json_string)
```

### CSV

```python
import csv

with open("data.csv", "r", newline="", encoding="utf-8") as file:
    reader = csv.DictReader(file)

    for row in reader:
        print(row)
```

For larger data analysis workflows, pandas is usually more convenient.

---

## 6. Essential Python libraries

Libraries extend Python's functionality. These are some of the most useful ones for professional development.

### Standard library

Included with Python — no additional installation required.

| Library | Purpose |
|---|---|
| `os` | Operating system interactions |
| `pathlib` | File and directory management |
| `json` | JSON data handling |
| `csv` | CSV file handling |
| `datetime` | Dates and times |
| `collections` | Specialized data structures |
| `re` | Regular expressions |
| `logging` | Application logging |
| `statistics` | Basic statistical calculations |
| `sqlite3` | SQLite database access |
| `subprocess` | Execute external commands |

### Data analysis and engineering

| Library | Purpose |
|---|---|
| `pandas` | Data manipulation and analysis |
| `numpy` | Numerical computing and arrays |
| `polars` | Fast DataFrame processing |
| `matplotlib` | Data visualization |
| `seaborn` | Statistical visualization |
| `google-cloud-bigquery` | BigQuery integration |

### APIs and integrations

| Library | Purpose |
|---|---|
| `requests` | HTTP requests and API integration |
| `httpx` | Synchronous and asynchronous HTTP |
| `pydantic` | Data validation and structured models |
| `google-cloud-storage` | Google Cloud Storage integration |

### Development and quality

| Library / tool | Purpose |
|---|---|
| `pytest` | Automated testing |
| `ruff` | Linting and code formatting |
| `mypy` | Static type checking |
| `pre-commit` | Run quality checks before Git commits |

### Applications and APIs

| Library | Purpose |
|---|---|
| `fastapi` | Build APIs |
| `streamlit` | Build interactive data applications |
| `pydantic` | Validate application data |

### Install libraries with UV

```bash
uv add pandas numpy requests
uv add --dev pytest ruff mypy
```

---

## 7. Data manipulation with pandas

Pandas is one of the most useful libraries for data analytics and engineering.

### Create a DataFrame

```python
import pandas as pd

data = {
    "name": ["John", "Jane", "Alex"],
    "age": [30, 25, 35],
    "salary": [40000, 45000, 50000]
}

df = pd.DataFrame(data)
```

### Read and write files

```python
df = pd.read_csv("data.csv")

df.to_csv("output.csv", index=False)

df = pd.read_excel("data.xlsx")

df.to_parquet("output.parquet", index=False)
```

### Explore data

```python
df.head()          # First rows
df.tail()          # Last rows
df.shape           # Rows and columns
df.columns         # Column names
df.dtypes          # Data types
df.info()          # DataFrame information
df.describe()      # Statistical summary
df.isna().sum()    # Missing values
```

### Filter and transform

```python
# Select a column
df["name"]

# Filter rows
df[df["age"] > 30]

# Select specific columns
df[["name", "salary"]]

# Create a new column
df["bonus"] = df["salary"] * 0.10

# Remove missing values
df.dropna()

# Replace missing values
df.fillna(0)

# Remove duplicates
df.drop_duplicates()

# Sort data
df.sort_values("salary", ascending=False)
```

### Group and aggregate

```python
df.groupby("department")["salary"].mean()

df.groupby("department").agg(
    average_salary=("salary", "mean"),
    employee_count=("salary", "count")
)
```

### Merge datasets

```python
result = pd.merge(
    employees,
    departments,
    on="department_id",
    how="left"
)
```

**Good practice:** Prefer vectorized pandas operations over manually iterating through rows whenever possible.

---

## 8. APIs and external data

Python is frequently used to connect systems and retrieve information through APIs.

### Make an HTTP request

Using `requests`:

```python
import requests

url = "https://api.example.com/data"

response = requests.get(url, timeout=30)

response.raise_for_status()

data = response.json()
```

### Send parameters

```python
params = {
    "page": 1,
    "limit": 100
}

response = requests.get(
    url,
    params=params,
    timeout=30
)
```

### Important HTTP status codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

**Good practices:**
- Always set a timeout.
- Check HTTP status codes.
- Handle API errors.
- Never hardcode API credentials in your source code.
- Respect API rate limits and pagination.
- Store credentials in environment variables or a secrets manager.

---

## 9. Error handling and debugging

Errors are part of software development. Handle them explicitly rather than hiding them.

### Try / except

```python
try:
    result = 10 / 0

except ZeroDivisionError as error:
    print(f"Calculation failed: {error}")

except Exception as error:
    print(f"Unexpected error: {error}")

finally:
    print("Execution finished")
```

Use specific exceptions whenever possible instead of catching every exception.

### Raise exceptions

```python
def calculate_discount(price: float, discount: float) -> float:
    if price < 0:
        raise ValueError("Price cannot be negative")

    return price * (1 - discount)
```

### Logging

Use `logging` instead of relying on `print()` for application diagnostics.

```python
import logging

logging.basicConfig(level=logging.INFO)

logging.info("Process started")
logging.warning("Missing values detected")
logging.error("Data processing failed")
```

Common logging levels:

| Level | Purpose |
|---|---|
| DEBUG | Detailed diagnostic information |
| INFO | General execution information |
| WARNING | Potential issue |
| ERROR | Operation failed |
| CRITICAL | Serious failure |

---

## 10. Good coding practices

Writing code that works is important. Writing code that other people can understand, maintain and reuse is equally important.

### Code readability

- Use descriptive variable and function names.
- Follow PEP 8 naming and formatting conventions.
- Keep functions small and focused.
- Avoid unnecessary complexity.
- Use comments to explain why something happens, not simply what the code does.

### Naming conventions

| Element | Convention | Example |
|---|---|---|
| Variables | snake_case | `customer_name` |
| Functions | snake_case | `calculate_total()` |
| Classes | PascalCase | `CustomerData` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Modules | snake_case | `data_processing.py` |

### Type hints

Type hints make code easier to understand and help tools detect potential errors.

```python
def calculate_total(
    price: float,
    quantity: int
) -> float:
    return price * quantity
```

For collections:

```python
def get_names() -> list[str]:
    return ["John", "Jane", "Alex"]
```

### Avoid duplicated code (DRY principle)

DRY means Don't Repeat Yourself.

Instead of repeating the same logic:

```python
def calculate_vat(price: float) -> float:
    return price * 0.21
```

Reuse the function wherever needed.

### Separate responsibilities

Avoid putting everything into one large script.

Separate data loading, transformations, business logic and output generation into reusable functions and modules.

### Use configuration instead of hardcoding

Keep environment-specific values outside your business logic.

For example, use environment variables for API URLs, credentials and configuration.

### Avoid unnecessary dependencies

Before installing a package, check whether Python's standard library already provides the functionality you need.

### Follow PEP 8

PEP 8 is Python's official style guide.

Reference: https://peps.python.org/pep-0008/

---

## 11. Testing and code quality

Testing helps ensure that your code behaves as expected and that changes don't introduce unexpected errors.

### Basic unit test with pytest

Create a file called `test_calculations.py`:

```python
from calculations import calculate_total

def test_calculate_total():
    result = calculate_total(10, 3)

    assert result == 30
```

Run tests:

```bash
uv run pytest
```

### Code quality with Ruff

Check your code:

```bash
uv run ruff check .
```

Automatically fix supported issues:

```bash
uv run ruff check . --fix
```

Format your code:

```bash
uv run ruff format .
```

**Recommended:** Use Ruff for consistent formatting and linting, and pytest for automated testing.

---

## 12. Recommended project structure

As projects grow, organize code into separate modules rather than keeping everything in one file.

Example:

```text
my-project/
│
├── .venv/
├── .gitignore
├── .python-version
├── pyproject.toml
├── uv.lock
├── README.md
│
├── src/
│   └── my_project/
│       ├── __init__.py
│       ├── main.py
│       ├── config.py
│       │
│       ├── data/
│       │   ├── __init__.py
│       │   └── load_data.py
│       │
│       ├── processing/
│       │   ├── __init__.py
│       │   └── transformations.py
│       │
│       └── utils/
│           ├── __init__.py
│           └── helpers.py
│
└── tests/
    └── test_processing.py
```

**Typical responsibilities:**

| File / folder | Responsibility |
|---|---|
| `main.py` | Main execution entry point |
| `config.py` | Project configuration |
| `data/` | Data loading and extraction |
| `processing/` | Data transformations and business logic |
| `utils/` | Reusable helper functions |
| `tests/` | Automated tests |
| `pyproject.toml` | Project configuration and dependencies |

The structure can vary depending on project size. Don't introduce unnecessary folders for small scripts.

---

## 13. Essential Python commands — Quick reference

| Action | Syntax |
|---|---|
| Print output | `print("Hello")` |
| Check type | `type(variable)` |
| Check length | `len(collection)` |
| Iterate | `for item in collection:` |
| Define function | `def my_function():` |
| Import library | `import pandas as pd` |
| Create list | `items = [1, 2, 3]` |
| Create dictionary | `data = {"name": "John"}` |
| List comprehension | `[x * 2 for x in numbers]` |
| Handle errors | `try / except` |
| Read environment variable | `os.getenv("API_KEY")` |
| Get current directory | `Path.cwd()` |
| Check file existence | `Path("file.csv").exists()` |

---

## 14. Recommended resources

- [Official Python Documentation](https://docs.python.org/3/)
- [Python Tutorial](https://docs.python.org/3/tutorial/)
- [PEP 8 — Style Guide](https://peps.python.org/pep-0008/)
- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [NumPy Documentation](https://numpy.org/doc/)
- [Real Python](https://realpython.com/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Ruff Documentation](https://docs.astral.sh/ruff/)

---

## 15. Recommended development workflow

A typical professional Python development workflow:

1. **Create or clone a project** using Git.
2. **Set up the environment** using UV.
3. **Install dependencies** and manage them through `pyproject.toml`.
4. **Organize code** into reusable functions and modules.
5. **Follow coding standards** using type hints, PEP 8 and Ruff.
6. **Test your code** using pytest.
7. **Handle errors and logging** appropriately.
8. **Commit changes** using Git and keep the project documentation updated.