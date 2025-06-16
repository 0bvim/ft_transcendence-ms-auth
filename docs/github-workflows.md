# GitHub Workflows Documentation

This document describes the GitHub Actions workflows configured for this project and how to use them effectively.

## Lint Workflow

The lint workflow runs ESLint on the codebase to ensure code quality and adherence to our style guidelines.

### Workflow File
`.github/workflows/lint.yml`

### Trigger Events
- **Push Events**: Triggered on pushes to `main` and `develop` branches.
- **Pull Request Events**: Triggered on pull requests targeting `main` and `develop` branches.

### Workflow Features

1. **Concurrency Control**
   - Only one instance of the workflow runs per branch/PR at a time
   - If a new workflow is triggered, any in-progress workflow on the same ref is cancelled

2. **Path Filtering**
   - Ignores changes to markdown files (except workflow files)
   - Ignores changes to documentation directories
   - Ensures linting isn't unnecessarily run for documentation-only changes

3. **Performance Optimizations**
   - Caches Node.js dependencies to speed up subsequent runs
   - Uses shallow clones to minimize checkout time

4. **Reporting**
   - Generates both JSON and HTML ESLint reports
   - Uploads reports as artifacts for later inspection
   - Annotates pull requests with ESLint findings using reviewdog

### Setting Up a Local Environment Like CI

To run the same checks locally that the CI runs:

```bash
# Install dependencies
npm ci

# Run ESLint checks
npm run lint

# Generate ESLint reports
npm run lint:report
```

## Adding or Modifying Workflows

When creating or modifying GitHub Actions workflows:

1. **Test Locally**: Use [act](https://github.com/nektos/act) to test GitHub Actions locally when possible
2. **Minimize Secret Usage**: Only include secrets when absolutely necessary
3. **Optimize for Speed**: Keep workflow run times under 5 minutes if possible
4. **Add Timeouts**: Always include timeout-minutes to prevent hanging workflows
5. **Document Changes**: Update this documentation when adding new workflows

## Available Workflows

| Workflow | File | Purpose |
|----------|------|---------|
| Lint | `.github/workflows/lint.yml` | Code quality checks with ESLint |

## Common Issues and Solutions

### ESLint Failures

If the ESLint check fails:

1. Run `npm run lint:fix` locally to auto-fix issues
2. Check the ESLint report artifact in the workflow run for detailed error information
3. Review the PR comments for inline annotations of issues

### Workflow Failures

If a workflow fails unexpectedly:

1. Check if the failure is due to GitHub Actions system issues by checking the [GitHub Status page](https://www.githubstatus.com/)
2. Look for errors in the workflow logs
3. Try re-running the workflow from the Actions tab in GitHub