# Git command quick reference

> **Category:** Cheat sheet · **Tags:** `git`, `commands`, `quick reference` · **Difficulty:** Beginner  
> **Last updated:** 2026-11-20

| Task | Command |
|---|---|
| Check working tree | `git status` |
| Review unstaged edits | `git diff` |
| Stage one file | `git add path/to/file` |
| Review staged edits | `git diff --staged` |
| Commit staged work | `git commit -m "Describe the change"` |
| Create and switch branch | `git switch -c feature/name` |
| List recent commits | `git log --oneline -10` |
| Update from remote | `git pull --rebase` |
| Push branch | `git push -u origin branch-name` |

> Before using a restore or reset command, check whether it will discard changes you want to keep.

Related: [Git & GitHub essentials](../tools/git-github.md).
