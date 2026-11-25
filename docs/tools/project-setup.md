# Project Setup

## Data projects

A data project commonly includes datasets and scripts or notebooks for loading, cleaning, analyzing and visualizing data. For example:

```text
my-project/
├── .git/
├── .venv/
├── .vscode/
├── src/
│   ├── main.py
│   └── utils.py
├── data/
│   └── dataset.csv
├── .env
├── .env.example
├── .gitignore
├── main.py
├── pyproject.toml
├── README.md
├── requirements.txt
└── uv.lock
```

These files and folders have different purposes and may be created by different tools or people:

| File or folder | What it contains | Who creates it |
|---|---|---|
| `.git/` | Git's internal version history and repository data. | Git, when you run `git init` or clone a repository. |
| `.venv/` | The project's isolated Python environment and installed packages. | `uv` (for example, when you run `uv sync`) or another environment tool. |
| `.vscode/` | Optional project-specific VS Code settings, launch configurations or recommended extensions. | You or your team in VS Code; it may also be committed with the project. |
| `src/` | Application or library source code, often organized into Python modules. | You or the project template. |
| `data/` | Project data files, such as `dataset.csv`. | You, a teammate or a data download/process. |
| `.env` | Local environment variables, which can include private credentials or machine-specific settings. | You, usually by copying values from `.env.example`; keep secrets out of Git. |
| `.env.example` | A shareable template listing the environment variable names the project needs, often with placeholder values. | You or the project maintainers. |
| `.gitignore` | File and folder patterns Git should ignore, such as `.venv/` and `.env`. | You, GitHub or a project template. |
| `main.py` | An optional top-level Python script used to start or run the project. | You or the project template. |
| `pyproject.toml` | Project metadata, Python requirements and tool or dependency configuration. | `uv init` or another project setup tool; you can edit it as the project changes. |
| `README.md` | Project overview, setup steps and usage instructions. | You or the project template. |
| `requirements.txt` | An optional list of Python packages, commonly used by `pip`. | You or a tool such as `pip freeze`; `uv` projects commonly manage dependencies in `pyproject.toml` and `uv.lock` instead. |
| `uv.lock` | Exact resolved versions of the project's dependencies for reproducible installs. | `uv`, when you add dependencies or run commands such as `uv lock` or `uv sync`. |

This example includes both `src/main.py` and a top-level `main.py` to show common layouts. A project usually chooses one entry point, depending on how its code is organized.

## App and web projects

An application or web project organizes its code around the app's features and often includes tests and, for a web app, templates and static assets. A Python web app managed with `uv` might look like this:

```text
my-app/
├── .git/
├── .venv/
├── .vscode/
├── src/
│   └── my_app/
│       ├── __init__.py
│       └── main.py
├── templates/
├── static/
├── tests/
├── .env
├── .env.example
├── .gitignore
├── pyproject.toml
├── README.md
└── uv.lock
```

The shared files and folders (such as `.git/`, `.venv/`, `.vscode/`, `.env`, `.gitignore`, `pyproject.toml`, `README.md` and `uv.lock`) serve the same purposes described above. App projects commonly add:

| File or folder | What it contains | Who creates it |
|---|---|---|
| `src/my_app/` | The app's Python package: its features, routes, business logic and other modules. | You or the project template. |
| `src/my_app/__init__.py` | Marks `my_app` as a Python package; it can also expose package-level code. | You or the project template. |
| `src/my_app/main.py` | The app's entry point, such as creating the web application or starting its server. | You or the project template. |
| `templates/` | HTML templates rendered by a web framework, if the app uses server-rendered pages. | You or the project template. |
| `static/` | Static assets served by the web app, such as CSS, JavaScript and images. | You or the project template. |
| `tests/` | Automated checks for app behavior. | You or the project template. |

The exact layout depends on the framework and project. A command-line app or desktop app may not need `templates/` or `static/`, and a small project may keep its Python files directly in `src/`.

When you open `my-project` in VS Code, the entire folder becomes your workspace.
