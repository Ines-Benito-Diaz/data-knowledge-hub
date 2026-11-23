# VS Code – Getting Started Guide

A practical introduction to Visual Studio Code for people who are new to the editor.

## 1. What is VS Code?

Visual Studio Code (VS Code) is a free code editor that allows you to write, edit, run and manage code.

It supports multiple programming languages and technologies, including Python, JavaScript, SQL, HTML and more.

Unlike a basic text editor, VS Code offers additional functionality through:

- **Extensions:** Add support for programming languages, formatting, debugging and other tools.
- **Integrated Terminal:** Run commands without leaving the editor.
- **Source Control:** Manage Git repositories and track code changes.
- **Workspace Settings:** Customize the editor for individual projects.

## 2. Understanding the VS Code interface

The main interface is divided into several areas:

- **Activity Bar:** The vertical bar on the left. Provides access to Explorer, Search, Source Control, Run and Debug, and Extensions.
- **Explorer:** Displays your project folders and files.
- **Editor:** The central area where you open and edit files.
- **Panel:** Usually located at the bottom. Contains the Terminal, Problems, Output and Debug Console.
- **Status Bar:** The bottom bar showing information about the current file, language, Git branch and other settings.

## 3. Understanding projects and workspaces

A **workspace** is the environment in which you work. In most cases, it simply means the project folder you have opened in VS Code.

For example, imagine you have this project:

```text
my-project/
│
├── src/
│   ├── main.py
│   └── utils.py
│
├── data/
│   └── dataset.csv
│
├── requirements.txt
└── README.md
```

When you open `my-project` in VS Code, the entire folder becomes your workspace.

**Important concepts:**

- **Folder:** A directory containing your project files.
- **Workspace:** The folder or collection of folders currently open in VS Code.
- **Multi-root workspace:** A workspace containing multiple independent project folders.
- **Workspace settings:** Settings that apply only to a particular project.

For most beginners, opening one project folder at a time is the best approach.

## 4. How to open an existing project

There are several ways to open a project.

### Option A – From VS Code

1. Open VS Code.
2. Go to `File → Open Folder...`.
3. Navigate to the folder containing your project.
4. Select the folder and click **Open**.
5. If prompted, confirm that you trust the authors of the files.

### Option B – From your computer

1. Locate the project folder in File Explorer (Windows) or Finder (Mac).
2. Right-click the folder.
3. Select **Open with Code**, if available.

### Option C – From the Terminal

If the VS Code command-line tool is available:

```bash
cd path/to/my-project
code .
```

The `.` means the current directory.

> **Tip:** Always open the main project folder rather than individual files. This allows VS Code to recognize the project structure and its configuration.

## 5. How to create a new project

1. Create a new folder on your computer.
2. Give it a descriptive name (e.g. `python-learning`).
3. Open VS Code.
4. Select `File → Open Folder...`.
5. Select your new folder.
6. Start creating files using the Explorer panel.

To create a file:

- Right-click the folder in Explorer.
- Select **New File**.
- Enter the filename, including its extension (e.g. `main.py`).

To create a subfolder:

- Right-click the folder.
- Select **New Folder**.

> **Tip:** Keep your projects organized in dedicated folders instead of saving everything directly on your Desktop.

## 6. Basic workspace configuration

You don't need to customize everything before getting started. However, a few settings can make your experience more comfortable.

Open Settings through:

- **macOS:** `Code → Settings → Settings`
- **Windows/Linux:** `File → Preferences → Settings`

Recommended settings to explore:

| Setting | Purpose |
|---|---|
| Auto Save | Automatically saves changes to files. |
| Word Wrap | Displays long lines of text across multiple lines. |
| Format On Save | Formats your code whenever you save a file, if a formatter is configured. |
| Font Size | Adjusts the editor's text size. |
| Theme | Changes the editor's appearance. |

### User Settings vs. Workspace Settings

- **User Settings** apply globally to your VS Code installation.
- **Workspace Settings** apply only to the currently opened project.

Use User Settings for personal preferences and Workspace Settings when a project requires specific configurations.

## 7. How to install extensions

Extensions are add-ons that provide additional functionality to VS Code.

### Installation steps

1. Open the **Extensions** view from the Activity Bar.
2. Search for the extension you want.
3. Select the extension to view its description, publisher and details.
4. Click **Install**.
5. Once installed, the extension is generally ready to use, although some require additional configuration.

### Managing extensions

From the Extensions view, you can:

- Install new extensions.
- Disable extensions temporarily.
- Uninstall extensions you no longer need.
- Update installed extensions.

> **Important:** Check the publisher and documentation before installing an extension. Some extensions require additional software or dependencies to work.

## 8. Recommended extensions

You don't need to install every available extension. The right selection depends on the programming languages and tools you use.

### General-purpose extensions

| Extension | What it does |
|---|---|
| Prettier – Code formatter | Automatically formats code to maintain consistent styling. |
| GitLens | Adds enhanced Git information, including who changed a line and when. |
| Material Icon Theme | Makes files and folders easier to identify using icons. |
| Code Spell Checker | Highlights spelling mistakes in code and documentation. |

### Python and data development

| Extension | What it does |
|---|---|
| Python (Microsoft) | Provides Python language support, debugging and code execution features. |
| Pylance (Microsoft) | Adds intelligent code completion, type checking and code navigation for Python. |
| Jupyter (Microsoft) | Allows you to create and run Jupyter notebooks inside VS Code. |
| Rainbow CSV | Makes CSV files easier to read by highlighting columns in different colors. |

### Web development

| Extension | What it does |
|---|---|
| ESLint | Identifies potential problems and enforces JavaScript/TypeScript coding rules. |
| Live Server | Launches a local development server for HTML projects and refreshes the browser when files change. |

> **A note about extensions:** Prettier and ESLint serve different purposes. Prettier formats code, while ESLint identifies potential issues and enforces coding rules. They can work together.

## 9. Using the integrated Terminal

The integrated Terminal allows you to execute commands directly inside VS Code.

To open it:

1. Go to `Terminal → New Terminal`.
2. A terminal panel will appear at the bottom.
3. You can now execute commands as you would in your computer's regular terminal.

For example:

```bash
# Check your current directory
pwd

# List files and folders
ls

# Navigate to a folder
cd my-project

# Create a new folder
mkdir data
```

The terminal usually opens in your workspace directory.

> **Important:** VS Code is an editor, not a programming language runtime. You may need to install additional software, such as Python or Node.js, to execute your code.

## 10. Working with Git

VS Code includes built-in Git integration, allowing you to manage version control without leaving the editor.

From the **Source Control** view, you can:

- See which files have changed.
- Review differences between versions.
- Stage changes.
- Commit changes.
- Push and pull changes from a remote repository.

> **Important:** Git must be installed separately on your computer. VS Code provides the interface, but Git performs the version-control operations.

For more advanced Git commands, see the [Git & GitHub essentials guide](../../git-github.html).

## 11. Recommended first-time setup checklist

- [ ] Install Visual Studio Code.
- [ ] Open your first project folder.
- [ ] Familiarize yourself with the Explorer, Editor and Terminal.
- [ ] Configure basic editor settings.
- [ ] Install extensions relevant to your programming language.
- [ ] Install any required programming language runtimes (e.g. Python).
- [ ] Check whether Git is installed.
- [ ] Learn how to save and organize your project files.

---

**Remember:** You don't need to understand every VS Code feature to start working. Begin with the basics and add tools as your projects require them.
