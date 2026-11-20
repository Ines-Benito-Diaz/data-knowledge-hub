# Data Knowledge Hub

A lightweight, static knowledge library. The dashboard is built with HTML, CSS and vanilla JavaScript; the documentation remains Markdown and the searchable catalog lives in JSON.

## Local preview

Because browsers restrict `fetch()` from `file://` pages, serve the repository folder locally:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Add a document

1. Create a Markdown file in the appropriate `docs/` category folder using `docs/templates/document-template.md`.
2. Add an entry to `assets/data/documents.json` with a unique `id`, a relative `path`, category, tool, tags, difficulty, ISO date, summary, and any related document IDs.
3. Set `quickAccess` to `true` to include it in the dashboard shortcuts.

Categories: `tools`, `projects`, `knowledge`, and `cheatsheets`. Paths in the catalog are relative to the repository root. Store content once; use `related` IDs and tags to make it discoverable from multiple directions.

## GitHub Pages

The site has no build step. In the repository settings, enable Pages from the `main` branch and `/ (root)`. For project pages, all asset and document links are relative paths, so the site can live under a repository subpath.

## Structure

- `index.html` — dashboard shell
- `assets/css/styles.css` — responsive visual system
- `assets/js/app.js` — catalog rendering, filters and search
- `assets/data/documents.json` — document metadata and relationships
- `docs/` — Markdown knowledge content
