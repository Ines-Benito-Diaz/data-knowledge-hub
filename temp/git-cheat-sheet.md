# Git Cheat Sheet

**Recommended course:** GitByGit — VS Code Extension  
**Language:** English  
**Purpose:** Quick reference for Git commands, workflows and best practices.

---

## 1. Configuration

Configure your Git identity and default behaviour.

### Do I need to configure Git every time I create a new project?

**No.** Most Git configuration is normally done once per computer/user using `--global`.

Global settings apply automatically to all your existing and future repositories. You do not need to repeat them when creating a new project.

### Global configuration — usually once per computer

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global core.autocrlf input
git config --global core.safecrlf warn
git config --global init.defaultBranch main
```

| Setting | Purpose |
|---|---|
| `user.name` | Name associated with your commits. |
| `user.email` | Email associated with your commits. |
| `core.autocrlf input` | Converts CRLF to LF when committing; does not convert files when checking them out. |
| `core.safecrlf warn` | Warns about potentially irreversible line-ending conversions. |
| `init.defaultBranch main` | Sets `main` as the default initial branch name. |

**Important:** `user.name` and `user.email` identify the author of your commits. They do not have to match your GitHub username.

### Local configuration — only when needed

If a specific project requires a different identity or setting, configure it inside that repository, without `--global`.

```bash
git config user.name "Work Name"
git config user.email "work@example.com"
```

Local configuration overrides the corresponding global setting for that repository.

### Check your configuration

```bash
git config --global --list
git config --local --list
git config --list
```

| Command | Purpose |
|---|---|
| `--global --list` | Shows global settings. |
| `--local --list` | Shows settings for the current repository. |
| `--list` | Shows the effective configuration from available scopes. |

**Remember:**
- Global configuration: normally once per computer/user.
- Local configuration: only when a project needs different settings.
- You do not need to configure Git from scratch for every new repository.

---

## 2. Navigate through directories

```bash
pwd
cd /path/to/project
```

| Command | Purpose |
|---|---|
| `pwd` | Prints the current working directory. |
| `cd folder` | Enters a folder. |
| `cd ..` | Moves one level up. |
| `cd ../..` | Moves two levels up. |
| `cd ./folder` | Enters a folder inside the current directory. |

**Tip:** Use `Tab` for terminal autocomplete.

---

## 3. Initialize a repository

```bash
git init
ls -a
```

- `git init`: turns the current directory into a Git repository.
- `ls -a`: displays hidden files and folders.
- Git creates a hidden `.git` directory containing repository metadata, configuration and history.

**Warning:** Deleting `.git` removes the repository metadata and local Git history.

---

## 4. Create a file

```bash
echo "Hello, World!" > hello.html
code hello.html
```

- `echo`: prints text in the terminal.
- `>`: creates a file or overwrites its contents.
- `code`: opens the file in VS Code.

---

## 5. Stage files

```bash
git add hello.html
git add .
git add -A
```

Moves changes from the **Working Directory** to the **Staging Area**.

| Command | Purpose |
|---|---|
| `git add file` | Stages a specific file. |
| `git add .` | Stages changes under the current directory and its subdirectories. |
| `git add -A` | Stages all changes in the repository, including deletions. |

---

## 6. Commit changes

```bash
git commit -m "Initial commit"
```

A commit saves a snapshot of the staged changes in the local repository history.

- `-m`: specifies the commit message.
- Use short, descriptive, action-oriented messages.

Example:

```bash
git commit -m "Add homepage structure"
```

---

## 7. Check repository status

```bash
git status
```

Shows the current state of your repository:

- **Untracked:** new files Git is not tracking yet.
- **Modified:** files that have been changed.
- **Staged:** changes prepared for a commit.
- **Deleted:** files that have been removed.
- **Clean working tree:** no pending changes.

Use `git status` frequently.

---

## 8. Compare changes with git diff

```bash
git diff
git diff HEAD
git diff --staged
git diff <commit> -- <file>
```

| Command | Comparison |
|---|---|
| `git diff` | Working Directory vs. Staging Area. |
| `git diff HEAD` | Working Directory + Staging Area vs. latest commit. |
| `git diff --staged` | Staging Area vs. latest commit. |
| `git diff <commit> -- <file>` | Compares a file with a specific commit. |

**Reading a diff:**
- `+` = added line.
- `-` = removed line.

`HEAD` normally points to the currently checked-out commit.

---

## 9. Restore Working Directory changes

```bash
git restore .
git restore <file>
```

Discards unstaged changes and restores files from the Staging Area.

**Warning:** this can permanently discard uncommitted modifications.

Use it when you want to undo changes made after the last staging operation.

---

## 10. Restore Staging Area changes

```bash
git restore --staged .
git restore --staged <file>
git restore --staged --worktree .
```

| Command | Result |
|---|---|
| `git restore --staged <file>` | Unstages the file but keeps its modifications in the Working Directory. |
| `git restore --staged .` | Unstages all changes. |
| `git restore --staged --worktree .` | Restores both the staging area and working files. |

**Warning:** the last command can discard staged and unstaged work by restoring tracked files to `HEAD`.

---

## 11. Amend the latest commit

```bash
git commit --amend -m "Updated commit message"
```

Replaces the most recent commit.

Useful when:
- You want to correct the latest commit message.
- You forgot to include a file or change (stage it first, then amend).

**Important:** amending creates a new commit hash. Avoid amending commits that have already been pushed or shared unless you coordinate with collaborators.

---

## 12. View commit history

```bash
git log
```

Displays commit history, newest first.

Includes:
- Commit hash.
- Author.
- Date.
- Commit message.

Pager shortcuts:
- `Space`: next page.
- `b`: previous page.
- `q`: quit.

---

## 13. Commit references

Git lets you refer to commits using hashes, tags, branches and relative references.

| Reference | Meaning |
|---|---|
| `HEAD` | Currently checked-out commit. |
| `HEAD~1` | First-parent commit before HEAD. |
| `HEAD~2` | Two first-parent commits before HEAD. |
| `HEAD^` | First parent of the current commit. |
| `HEAD^2` | Second parent of a merge commit. |
| `a32f8c1` | Example of an abbreviated commit hash. |
| `main` | Commit pointed to by the `main` branch. |
| `1.0` | Commit pointed to by the `1.0` tag. |

A commit can be identified by its full or abbreviated SHA-1 hash.

---

## 14. Tags

```bash
git tag 1.0
git tag
```

Tags give a name to a specific commit, commonly to mark releases.

- `git tag 1.0`: creates a lightweight tag on the current commit.
- `git tag`: lists available tags.

**Branch vs. Tag:**
- A branch normally moves forward as new commits are added.
- A tag normally stays attached to the commit it identifies.

---

## 15. List branches

```bash
git branch
```

Lists local branches.

The `*` identifies the currently checked-out branch.

---

## 16. Create and switch branches

```bash
git switch -c style
git switch main
```

| Command | Purpose |
|---|---|
| `git switch -c style` | Creates a branch called `style` and switches to it. |
| `git switch main` | Switches to the existing `main` branch. |

Branches let you develop features independently without changing the main line of development.

---

## 17. Merge and delete branches

```bash
git switch main
git merge style
git branch -d style
```

Typical workflow:
1. Switch to the destination branch (`main`).
2. Merge the feature branch into it.
3. Delete the feature branch when it is no longer needed.

- `git merge style`: integrates `style` into the current branch.
- `git branch -d style`: deletes the local branch if Git considers it safely merged.

Deleting a branch does not delete commits that are already reachable from another branch.

---

## 18. Compact commit history

```bash
git log --oneline
```

Displays one concise line per commit, with abbreviated hash and commit subject.

Useful for quickly reviewing recent history.

---

## 19. Filter commit history

```bash
git log --oneline --max-count=2
git log --oneline --since="5 minutes ago"
git log --oneline --until="5 minutes ago"
git log --oneline --author="Your Name"
git log --oneline --all
```

| Option | Purpose |
|---|---|
| `--max-count=2` | Limits the number of commits shown. |
| `--since` | Shows commits after a date/time. |
| `--until` | Shows commits before a date/time. |
| `--author` | Filters by author. |
| `--all` | Includes commits reachable from all refs, such as branches and tags. |

Filters can be combined.

---

## 20. Customize log output

```bash
git log --format="%h %ad | %s%d [%an]" --date=short
```

| Placeholder | Meaning |
|---|---|
| `%h` | Abbreviated commit hash. |
| `%ad` | Author date. |
| `%s` | Commit subject. |
| `%d` | Ref decorations (branches and tags). |
| `%an` | Author name. |
| `--date=short` | Short date format. |

---

## 21. Configure default log format

```bash
git config format.pretty "%h %ad | %s%d [%an]"
git config log.date short
```

These settings customize the default log display for the current repository.

Add `--global` if you want the configuration to apply to all your repositories.

---

## 22. View the history of a specific file

```bash
git log hello.html
git log --oneline -- hello.html
```

Shows commits that affected a particular file.

The `--` separates revision/options from the file path.

---

## 23. Compare commits

```bash
git diff <from> <to>
git diff 1.0 HEAD
```

Compares the content of two commits without changing the repository.

You can use:
- Commit hashes.
- Tags.
- Branch names.
- Relative references such as `HEAD~1`.

---

## 24. Revert a commit

```bash
git revert <commit>
git revert a32f8c1
```

Creates a **new commit** that reverses the changes introduced by an earlier commit.

Use it when you need to undo a commit without rewriting history, especially when the commit has already been shared.

A revert can produce merge conflicts that need to be resolved.

---

## 25. Reset

```bash
git reset
git reset main
git reset --soft HEAD~1
git reset --mixed HEAD~1
git reset --hard HEAD~1
```

`git reset` moves the current branch pointer to a target commit and can also update the Staging Area and Working Directory.

### Reset modes

| Mode | Branch / HEAD | Staging Area | Working Directory |
|---|---|---|---|
| `--soft` | Moves | Preserved | Preserved |
| `--mixed` (default) | Moves | Reset | Preserved |
| `--hard` | Moves | Reset | Reset |

**Examples:**

- `git reset`: unstages staged changes (defaults to `HEAD` and `--mixed`).
- `git reset main`: moves the current branch to the commit pointed to by `main`; it does not switch branches.
- `git reset --soft HEAD~1`: removes the latest commit from the current branch while keeping its changes staged.
- `git reset --mixed HEAD~1`: moves the branch back one commit and leaves changes in the Working Directory, unstaged.
- `git reset --hard HEAD~1`: moves the branch back one commit and discards changes in the index and Working Directory.

**DANGER:** `--hard` can permanently discard uncommitted work and make commits unreachable.

### Reset vs. Restore

- `git restore`: restores file contents; does not move the branch pointer.
- `git reset`: can move the current branch pointer and change the staging state.

---

## 26. Stash

```bash
git stash
git stash list
git stash pop
git stash apply
git stash drop
git stash clear
git stash -u
```

Stash temporarily stores work in progress so you can switch tasks or branches without committing unfinished changes.

| Command | Purpose |
|---|---|
| `git stash` | Saves tracked changes and cleans the working tree. |
| `git stash list` | Lists saved stashes. |
| `git stash pop` | Applies the latest stash and removes it if successful. |
| `git stash apply` | Applies a stash but keeps it in the stash list. |
| `git stash drop` | Deletes a selected stash. |
| `git stash clear` | Deletes all stashes. |
| `git stash -u` | Also includes untracked files. |

**Stash vs. Commit:**
- Stash: temporary storage for unfinished work.
- Commit: permanent snapshot in the repository history.

---

## 27. Remote repositories, clone and fork

### Core concepts

| Term | Meaning |
|---|---|
| Local repository | Your copy of the project on your computer. |
| Remote repository | A repository hosted elsewhere, for example on GitHub. |
| `origin` | Conventional name for the first remote. |
| Push | Sends local commits to a remote. |
| Pull | Fetches and integrates remote changes. |
| Fetch | Downloads remote changes without integrating them. |

### Clone

```bash
git clone https://github.com/username/project.git
```

Downloads an existing remote repository and creates a local copy. It also configures the remote automatically.

Use it when you want to start working on an existing project.

### Fork

A fork is a server-side copy of another repository under your own account.

Typical workflow:
1. Fork the original repository on GitHub.
2. Clone your fork.
3. Make changes locally.
4. Push changes to your fork.
5. Open a Pull Request to the original repository.

Changes from the original repository do not automatically appear in your fork; you must sync them.

---

## 28. Connect a remote repository

```bash
git remote add origin https://github.com/username/project.git
git remote -v
```

- `git remote add`: adds a remote repository.
- `origin`: conventional remote name.
- `git remote -v`: displays remote URLs for fetching and pushing.

### Correct a remote URL

```bash
git remote set-url origin https://github.com/correct-url.git
```

Alternative:

```bash
git remote remove origin
git remote add origin https://github.com/correct-url.git
```

`origin` is a convention, not a mandatory name.

---

## 29. Push changes

```bash
git push origin main
git push -u origin main
```

Uploads local commits from `main` to the remote branch `main` on `origin`.

- `git push origin main`: pushes the specified branch.
- `-u`: sets the upstream tracking relationship.

After setting upstream, you can usually use:

```bash
git push
```

---

## 30. Pull changes

```bash
git pull origin main
```

Fetches remote changes and integrates them into the current branch.

By default, pull performs a fetch followed by a merge (although configuration can make it rebase instead).

Conceptually:

```bash
git fetch origin
git merge origin/main
```

Make sure you are on the local branch where you want to integrate the changes.

---

## 31. Fetch changes

```bash
git fetch
git fetch origin
git log --oneline main..origin/main
```

Downloads remote objects and updates remote-tracking references without integrating the changes into your current branch.

- `git fetch`: fetches from configured remotes.
- `git fetch origin`: fetches from `origin`.
- `git log main..origin/main`: shows commits reachable from remote `main` that are not reachable from local `main`.

### Fetch vs. Pull

| Fetch | Pull |
|---|---|
| Downloads remote updates. | Downloads and integrates remote updates. |
| Does not change your current branch's contents. | Can update your current branch. |
| Lets you inspect changes first. | Convenient when you're ready to integrate. |

---

## 32. Force push and shared history

```bash
git push --force
git push --force-with-lease
```

Force push overwrites the remote branch history with your local branch history.

**DANGER:** it can remove commits from the remote branch that other collaborators depend on.

### Force vs. Force-with-lease

| Command | Behaviour |
|---|---|
| `git push --force` | Forces the update, even if the remote has commits you do not have locally. |
| `git push --force-with-lease` | Checks that the remote branch has not advanced unexpectedly compared with your expected remote-tracking state. |

`--force-with-lease` is safer, but it is not risk-free.

**Golden rule:** avoid rewriting public/shared history. Coordinate with collaborators before doing it.

When you need to undo a commit that has already been shared, prefer:

```bash
git revert <commit>
```

Removing sensitive data from Git history requires a coordinated history rewrite and collaborators may need to re-sync their local repositories.

---

# Git workflow: from local changes to GitHub

```text
       WORKING DIRECTORY
       Edit / create files
               |
               | git add
               v
        STAGING AREA
        Prepare changes
               |
               | git commit
               v
       LOCAL REPOSITORY
       Save commit history
               |
               | git push
               v
       REMOTE REPOSITORY
             GitHub
```

To bring changes from GitHub:

```text
REMOTE REPOSITORY
       |
       | git fetch
       v
REMOTE-TRACKING BRANCH
       |
       | git merge / rebase
       v
LOCAL BRANCH
```

`git pull` combines fetching and integration.

---

# Essential best practices

## Before starting work

```bash
git status
git branch
git pull
git switch -c feature/my-feature
```

- Check your current branch and working tree.
- Synchronize with the remote.
- Create a feature branch for new work.

## While working

- Make small, logical commits.
- Use descriptive commit messages.
- Review changes with `git diff` before staging.
- Check `git status` regularly.
- Do not commit passwords, tokens, secrets or temporary files.
- Use `git stash` for unfinished work when you need to switch context.

## Before pushing

```bash
git status
git log --oneline
git diff
git push
```

- Review your changes and commit history.
- Ensure you are pushing to the correct remote and branch.
- Synchronize with shared work.
- Avoid force pushing shared branches.

## When undoing changes

| Situation | Recommended command |
|---|---|
| Discard unstaged file changes | `git restore <file>` |
| Unstage a file but keep its edits | `git restore --staged <file>` |
| Undo a local commit but keep changes staged | `git reset --soft HEAD~1` |
| Undo a local commit and keep edits unstaged | `git reset HEAD~1` |
| Undo a shared commit safely | `git revert <commit>` |
| Temporarily save unfinished work | `git stash` |

---

# Quick comparison reference

| Commands | Main difference |
|---|---|
| `git restore` vs. `git reset` | Restore changes in files vs. move branch pointer / reset staging. |
| `git reset --soft` vs. `--mixed` vs. `--hard` | Preserve everything vs. reset staging vs. reset staging and working files. |
| `git stash` vs. `git commit` | Temporary work storage vs. permanent history snapshot. |
| `git fetch` vs. `git pull` | Download only vs. download and integrate. |
| `git revert` vs. `git reset` | Create a new undo commit vs. move the current branch pointer. |
| `git push --force` vs. `--force-with-lease` | Unconditional overwrite vs. overwrite with a remote-state safety check. |
| Branch vs. Tag | Moving development pointer vs. fixed reference to a commit. |
| Clone vs. Fork | Local copy of a repository vs. server-side copy under your account. |

---

**Remember:** Git is easiest to work with when you understand the three main local areas — Working Directory, Staging Area and Local Repository — and how they interact with the Remote Repository.