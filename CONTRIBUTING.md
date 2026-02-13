# Contributing to ContribForge

First off, thanks for taking the time to contribute.
ContribForge exists to make open-source contribution easier, and every contribution helps move that mission forward.

This document outlines how you can contribute effectively.

---

## Code of Conduct

By participating in this project, you agree to follow our Code of Conduct.

Be respectful, inclusive, and constructive.
Harassment, discrimination, or unprofessional behavior will not be tolerated.

---

## Ways to Contribute

You can contribute in multiple ways:

* Fix bugs
* Add new features
* Improve UI/UX
* Enhance documentation
* Refactor existing code
* Review pull requests
* Suggest ideas or improvements

All contributions are welcome.

---

## Getting Started

### 1. Fork the Repository

Fork the repo to your GitHub account and clone it locally:

```bash
git clone https://github.com/your-username/contribforge.git
cd contribforge
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Run the Project Locally

```bash
npm run dev
```

The app should now be running on `http://localhost:3000`.

---

## Project Structure (High-Level)

```text
src/
 ├── components/     # Reusable UI components
 ├── pages/          # Page-level components / routes
 ├── services/       # API & external integrations
 ├── hooks/          # Custom React hooks
 ├── utils/          # Helper functions
 └── styles/         # Global styles
```

Please keep changes consistent with the existing structure.

---

## Choosing an Issue

* Check existing issues before creating a new one
* Look for issues labeled:

  * `good first issue`
  * `help wanted`
  * `enhancement`
* If you’re unsure, comment on the issue before starting

---

## Branch Naming Convention

Use clear and descriptive branch names:

```text
feature/issue-search-filters
fix/dashboard-layout-bug
docs/update-contributing-guide
```

---

## Commit Message Guidelines

Follow a simple, consistent format:

```text
feat: add advanced issue filters
fix: resolve bookmark sync bug
docs: update contributing guide
refactor: simplify dashboard state logic
```

Keep commits small and focused.

---

## Pull Request Guidelines

Before submitting a PR, ensure:

* Code builds without errors
* No linting issues
* UI changes are responsive
* Related issue is referenced

### PR Title Example

```text
feat: add bookmarking folders to dashboard
```

### PR Description Should Include

* What problem it solves
* Screenshots (for UI changes)
* Related issue number

---

## Code Style & Best Practices

* Follow existing patterns and conventions
* Write readable and maintainable code
* Avoid unnecessary complexity
* Prefer reusable components
* Use meaningful variable and function names

---

## UI/UX Contributions

If your contribution affects UI:

* Keep it minimal and consistent
* Avoid unnecessary animations
* Ensure accessibility (contrast, spacing)
* Test on different screen sizes

---

## Documentation Contributions

Documentation improvements are highly valued.

You can:

* Fix typos
* Improve clarity
* Add examples
* Update outdated information

No code contribution is too small.

---

## Reporting Bugs

When reporting bugs, include:

* Steps to reproduce
* Expected behavior
* Actual behavior
* Screenshots or logs (if applicable)
* Browser / OS details

---

## Feature Requests

Feature requests should include:

* Problem statement
* Proposed solution
* Why it benefits contributors
* Optional mockups or examples

---

## Review Process

* Maintainers will review PRs as soon as possible
* Feedback may be requested
* Be open to suggestions and changes

Once approved, your PR will be merged.

---

## Community & Support

If you need help:

* Comment on the relevant issue
* Open a discussion
* Ask questions respectfully

We aim to keep ContribForge beginner-friendly and collaborative.

---

## Final Note

Open source is about learning and collaboration.
Don’t worry about being perfect.
If you’re unsure, ask.

Happy contributing.
