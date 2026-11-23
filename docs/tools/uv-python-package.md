# UV — Installation & Usage Guide

## 1. What is UV?

**UV** is a fast Python package and project manager developed by Astral.

It combines several tools traditionally used separately:

| Traditional tool | UV equivalent | Purpose |
|---|---|---|
| `pyenv` | `uv python` | Manage Python versions |
| `venv` | `uv venv` | Create virtual environments |
| `pip` | `uv add` / `uv pip` | Manage dependencies |
| `pip-tools` | `uv lock` | Lock dependency versions |
| `pipx` | `uv tool` / `uvx` | Run standalone tools |

UV manages Python installations, project dependencies, virtual environments and project configuration.

## 2. Installation

### Install UV

**macOS / Linux — Terminal**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows — PowerShell**

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Verify installation

Restart the terminal if necessary, then run:

```bash
uv --version
```

### Update UV

For standalone installations:

```bash
uv self update
```

If installed through Homebrew or pip, update it using the same package manager.

Official documentation: https://docs.astral.sh/uv/getting-started/installation/

## 3. Understanding the project structure

UV uses a few important files and folders to manage Python projects.

| File / folder | Purpose |
|---|---|
| `pyproject.toml` | Project configuration and dependencies |
| `uv.lock` | Exact resolved dependency versions |
| `.venv/` | Virtual environment containing installed packages |
| `.python-version` | Python version selected for the project |

Example structure:

```text
my-project/
│
├── .venv/
├── .python-version
├── pyproject.toml
├── uv.lock
├── .gitignore
└── main.py
```

**Important:**
- `pyproject.toml` defines project requirements.
- `uv.lock` ensures consistent dependency versions across environments.
- `.venv` contains the project's isolated Python environment.
- `.python-version` specifies the project's default Python version.

**Git best practice:** Commit `pyproject.toml`, `uv.lock` and `.python-version` when applicable. Never commit `.venv/`.

## 4. Creating a new Python project

### Step 1 — Initialize the project

Navigate to the directory where you want to create your project:

```bash
uv init my-project
cd my-project
```

If you're already inside the project folder, simply run:

```bash
uv init
```

### Step 2 — Select a Python version

List available Python versions:

```bash
uv python list
```

Install a specific version if needed:

```bash
uv python install 3.12
```

Set the version for your project:

```bash
uv python pin 3.12
```

This creates or updates `.python-version`.

### Step 3 — Create the environment

```bash
uv sync
```

UV creates `.venv`, resolves dependencies, generates or updates `uv.lock`, and installs the required packages.

**Note:** UV can automatically download a compatible Python version when required, so a separate Python installation is not always necessary.

## 5. Managing dependencies

Dependencies are external Python libraries required by your project, such as `pandas`, `numpy` or `requests`.

| Action | Command |
|---|---|
| Add a dependency | `uv add pandas` |
| Add several dependencies | `uv add pandas numpy matplotlib` |
| Add a development dependency | `uv add --dev pytest` |
| Remove a dependency | `uv remove pandas` |
| Update all dependencies | `uv lock --upgrade` |
| Update one dependency | `uv lock --upgrade-package pandas` |
| Synchronize environment | `uv sync` |
| Display dependency tree | `uv tree` |

When you run `uv add`, UV automatically updates `pyproject.toml`, updates `uv.lock` and synchronizes the environment.

**Development dependencies** are tools used during development, such as testing and formatting libraries, rather than application runtime dependencies.

## 6. Running Python code and managing environments

### Recommended approach: `uv run`

UV can execute Python code directly within the project's environment.

```bash
# Run a Python file
uv run main.py

# Check Python version
uv run python --version

# Run a module
uv run python -m pytest
```

UV automatically checks and synchronizes the environment before executing the command.

### Alternative: Activate the virtual environment

You can also activate `.venv` and use Python directly.

**macOS / Linux**

```bash
source .venv/bin/activate
```

**Windows — PowerShell**

```powershell
.venv\Scripts\Activate.ps1
```

Once activated:

```bash
python main.py
```

To deactivate:

```bash
deactivate
```

**Recommendation:** Use `uv run` for everyday workflows. Manual activation is optional.

## 7. Working with an existing project (Git)

When someone shares a UV project with you, you don't need to install dependencies individually.

### Step 1 — Clone the repository

```bash
git clone <repository-url>
cd my-project
```

### Step 2 — Synchronize the environment

```bash
uv sync
```

UV reads `pyproject.toml` and `uv.lock`, creates `.venv` if necessary, and installs the required dependencies.

### Step 3 — Run the project

```bash
uv run main.py
```

**Workflow:**

```text
Clone repository
       |
       v
    uv sync
       |
       v
  uv run main.py
```

**Important:** When collaborating, commit changes to `pyproject.toml` and `uv.lock` whenever dependencies change. This allows other developers to synchronize their environments using `uv sync`.

## 8. Essential commands & troubleshooting

### Quick command reference

| Command | Purpose |
|---|---|
| `uv --version` | Check UV version |
| `uv self update` | Update UV |
| `uv init` | Initialize a project |
| `uv python list` | List Python versions |
| `uv python install 3.12` | Install Python |
| `uv python pin 3.12` | Set project Python version |
| `uv add package` | Add dependency |
| `uv add --dev package` | Add development dependency |
| `uv remove package` | Remove dependency |
| `uv sync` | Synchronize environment |
| `uv lock --upgrade` | Upgrade dependencies |
| `uv run main.py` | Run Python code |
| `uv tree` | Display dependency tree |
| `uvx ruff check .` | Run a tool temporarily |
| `uv help` | Display help |

### Common issues

| Problem | Solution |
|---|---|
| `uv: command not found` | Restart terminal and check PATH |
| Dependencies are missing | Run `uv sync` |
| Wrong Python version | Check `.python-version` and run `uv python pin` |
| Environment issues | Run `uv sync` to recreate/synchronize the environment |

### Official documentation

- [UV Documentation](https://docs.astral.sh/uv/)
- [Installation Guide](https://docs.astral.sh/uv/getting-started/installation/)
- [Project Management](https://docs.astral.sh/uv/guides/projects/)
- [Python Version Management](https://docs.astral.sh/uv/guides/install-python/)
- [GitHub Repository](https://github.com/astral-sh/uv)