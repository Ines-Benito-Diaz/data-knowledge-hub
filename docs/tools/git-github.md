# Git & GitHub essentials

> **Category:** Tool · **Tags:** `git`, `github`, `workflow` · **Difficulty:** Beginner  
> **Last updated:** 2026-11-20

## Overview

Git records changes in a project so you can inspect, share and revisit its history. GitHub hosts Git repositories and adds collaboration features.

## Configure Git

Set your identity once for your user account. Use local settings when a specific repository needs another identity.

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --list
```

## Everyday workflow

```bash
git status                 # inspect changes
git add path/to/file       # stage a focused change
git diff --staged          # review what will be committed
git commit -m "Add guide"  # record the staged snapshot
git push                   # send commits to the remote
```

Use `git add -A` only when you have reviewed all repository changes and intend to stage them.

## Branches and collaboration

```bash
git switch -c feature/my-change
git push -u origin feature/my-change
git pull --rebase
```

Create a focused branch, commit related changes together, and open a pull request when review is useful.

## Common checks

- `git status` shows staged, unstaged and untracked changes.
- `git diff` reviews unstaged edits; `git diff --staged` reviews staged edits.
- `git log --oneline --decorate -10` gives a compact history.
- Review a command before using `git restore` or `git reset`; some forms discard work.

## Related documentation

- [Git command quick reference](../cheatsheets/git-commands.md)
- [Publish a static site with GitHub Pages](../projects/github-pages.md)
