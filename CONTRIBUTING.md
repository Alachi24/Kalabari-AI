# Contributing to Kalabari-AI

Thank you for your interest in contributing to Kalabari-AI. This guide covers everything you need to know to get started and contribute effectively.

---

## Getting Started

Before anything else, get the project running locally by following the [Setup Guide](docs/setup.md).

---

## Branching

Always create a new branch from `main` before making any changes. Never work directly on `main`.

```bash
git checkout main
git pull origin main
git checkout -b <prefix>/<short-description>
```

Use one of these prefixes depending on what you're working on:

| Prefix | When to use |
|---|---|
| `feat/` | Adding a new feature |
| `fix/` | Fixing a bug |
| `docs/` | Documentation changes |
| `chore/` | Maintenance, config, or tooling changes |
| `refactor/` | Code restructuring with no behaviour change |

**Examples:**
- `feat: add Kalabari text input component`
- `fix: resolve token expiry on auth callback`
- `docs: add local setup guide`
- `chore: update pnpm lockfile`

Keep the description short and in lowercase. Use the imperative tense — "add" not "added", "fix" not "fixed".

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

---

## Opening a Pull Request

When your work is ready:

1. Push your branch to GitHub:
   
```bash
git push origin <your-branch-name>
```

1. Go to the repository on GitHub and open a Pull Request against `main`
2. Fill in a clear title following the commit message format
3. In the description, explain what the PR does and any relevant context
4. Assign at least one reviewer from the core team or there'll already be an assigned one depending on who made the issue.

A PR must have at least one approval before it can be merged.

---

## What to Include in a PR Description

A good PR description covers:

- **What this does** — a brief summary of the change
- **Changes** — a list of files changed and why
- **Notes** — anything reviewers should be aware of (edge cases, follow-up tasks, open questions)

---

## Code Style

- TypeScript is used throughout the frontend — maintain type safety, avoid `any`
- Follow the existing patterns in the codebase
- Keep changes focused — one concern per PR

---

## Need Help?

If you're stuck or have questions, reach out to the core team directly. We're a small team and happy to help.
