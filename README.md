# Data Knowledge Hub

Data Knowledge Hub is a personal library for organizing practical technical knowledge in one place. It brings together concise references for data and development tools, alongside project notes that document data workflows and small web products. The goal is to make useful knowledge easier to keep, revisit, and build on over time.

## Structure

- `index.html` is the hub landing page, linking to the Tools and Projects collections.
- `tools.html` and `projects.html` are collection pages. Their cards and filter options are populated from `assets/data/documents.json`.
- Individual HTML pages provide each guide screen. Guides that have multiple topics use in-page tabs and a generated section index.
- `docs/tools/` contains the Markdown source for guide content. `assets/js/guide-content.js` renders that content and builds the indexes; `assets/js/collections.js` handles collection cards and filters.
- `assets/css/styles.css` provides the shared visual design and responsive layouts.

## Topics

The Tools collection covers Git and GitHub, VS Code and project setup, UV, Python fundamentals and Polars, SQL, and Power BI DAX. The Projects collection is intended for data workflow notes and documentation of small web projects.

The site is built with static HTML, CSS, JavaScript, JSON, and Markdown.
