# CI/CD Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment of the Investors Finding Project.

## Workflows Overview

### 1. CI Workflow (`ci.yml`)

**Triggers:**
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main`, `master`, or `develop` branches

**Jobs:**
- **Lint and Type Check**: Runs ESLint, Biome linting, and TypeScript type checking
- **Test**: Runs unit tests with a PostgreSQL test database
- **Build**: Builds the Next.js application and uploads artifacts

**Status Badge:**
```markdown
![CI](https://github.com/AntoineNaccache/Investors-finding-project/workflows/CI/badge.svg)
```

### 2. CD Workflow (`cd.yml`)

**Triggers:**
- Push to `main` or `master` branches (deploys to staging)
- Tags starting with `v*` (deploys to production)
- Manual workflow dispatch with environment selection

**Jobs:**
- **Deploy to Staging**: Automatically deploys main/master branch changes
- **Deploy to Production**: Deploys tagged releases and creates GitHub releases

**Configuration Required:**
Add these secrets in GitHub repository settings:
- `STAGING_POSTGRES_URL`
- `STAGING_BETTER_AUTH_SECRET`
- `PRODUCTION_POSTGRES_URL`
- `PRODUCTION_BETTER_AUTH_SECRET`

### 3. Docker Workflow (`docker.yml`)

**Triggers:**
- Push to `main`, `master`, or `develop` branches
- Tags starting with `v*`
- Pull requests (build only, no push)
- Manual workflow dispatch

**Jobs:**
- **Build and Push to GitHub Container Registry**: Automatically pushes to `ghcr.io`
- **Build and Push to Docker Hub**: Optionally pushes to Docker Hub (requires configuration)

**Docker Hub Configuration (Optional):**
Add these secrets if you want to push to Docker Hub:
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token

**Pull the image:**
```bash
# From GitHub Container Registry
docker pull ghcr.io/antoinenaccache/investors-finding-project:latest

# From Docker Hub (if configured)
docker pull yourusername/investors-finding-project:latest
```

### 4. Security Workflow (`security.yml`)

**Triggers:**
- Push to `main`, `master`, or `develop` branches
- Pull requests
- Daily at 2 AM UTC (scheduled)
- Manual workflow dispatch

**Jobs:**
- **Dependency Audit**: Runs `pnpm audit` to check for vulnerabilities
- **CodeQL Analysis**: Static code analysis for security issues
- **Dependency Review**: Reviews dependency changes in pull requests

## Setup Instructions

### 1. Enable GitHub Actions

GitHub Actions should be enabled by default. Verify in repository settings:
- Go to **Settings** → **Actions** → **General**
- Ensure "Allow all actions and reusable workflows" is selected

### 2. Configure Environments

Create deployment environments for better control:
- Go to **Settings** → **Environments**
- Create `staging` and `production` environments
- Add environment protection rules (e.g., required reviewers for production)

### 3. Add Secrets

Add the following secrets in **Settings** → **Secrets and variables** → **Actions**:

**Required for CD:**
- `STAGING_POSTGRES_URL`: PostgreSQL connection string for staging
- `STAGING_BETTER_AUTH_SECRET`: Auth secret for staging
- `PRODUCTION_POSTGRES_URL`: PostgreSQL connection string for production
- `PRODUCTION_BETTER_AUTH_SECRET`: Auth secret for production

**Optional for Docker Hub:**
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Docker Hub access token (create at hub.docker.com/settings/security)

**Optional for API Keys (if deploying with LLM providers):**
- `GROQ_API_KEY`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`

### 4. Configure Deployment

The CD workflow includes placeholder deployment steps. Update the deployment commands based on your infrastructure:

**Vercel:**
```yaml
- name: Deploy to Vercel
  run: |
    npm i -g vercel
    vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

**Railway:**
```yaml
- name: Deploy to Railway
  run: |
    npm i -g @railway/cli
    railway up
  env:
    RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

**Docker on your server:**
```yaml
- name: Deploy to Server
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    key: ${{ secrets.SERVER_SSH_KEY }}
    script: |
      docker pull ghcr.io/antoinenaccache/investors-finding-project:latest
      docker-compose up -d
```

## Usage

### Running CI on Pull Requests

CI automatically runs when you:
1. Create a pull request
2. Push commits to an existing pull request

All checks must pass before merging.

### Deploying to Staging

1. Merge changes to `main` or `master` branch
2. Workflow automatically deploys to staging environment

### Deploying to Production

1. Create a new version tag:
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```
2. Workflow automatically deploys to production and creates a GitHub release

### Manual Deployment

1. Go to **Actions** → **CD - Deploy**
2. Click **Run workflow**
3. Select environment (staging or production)
4. Click **Run workflow** button

## Workflow Status

Monitor workflow runs:
- **Actions tab**: View all workflow runs
- **Pull requests**: See status checks before merging
- **Email notifications**: Receive alerts on workflow failures

## Docker Image Tags

Images are tagged as follows:
- `latest`: Latest build from main/master branch
- `v1.0.0`: Specific version tags
- `v1.0`: Major.minor version
- `v1`: Major version
- `main-abc1234`: Branch name with commit SHA
- `pr-123`: Pull request number

## Troubleshooting

### Build Failures

1. Check the workflow logs in the Actions tab
2. Reproduce locally:
   ```bash
   pnpm install
   pnpm lint
   pnpm check-types
   pnpm test
   pnpm build:local
   ```

### Deployment Failures

1. Verify all required secrets are set
2. Check deployment target is accessible
3. Review deployment logs in workflow run

### Docker Build Failures

1. Test Docker build locally:
   ```bash
   docker build -f docker/Dockerfile -t investors-finding-project .
   ```
2. Ensure all required files are included (not in .dockerignore)

## Maintenance

### Update pnpm Version

When updating pnpm, update the version in all workflow files:
```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 10.2.1  # Update this version
```

### Update Node.js Version

When updating Node.js, update in all workflow files:
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Update this version
```

## Best Practices

1. **Always run CI locally** before pushing:
   ```bash
   pnpm check
   ```

2. **Test Docker builds** before pushing:
   ```bash
   docker-compose -f docker/compose.yml up --build
   ```

3. **Use semantic versioning** for releases:
   - Major: Breaking changes (v2.0.0)
   - Minor: New features (v1.1.0)
   - Patch: Bug fixes (v1.0.1)

4. **Review security alerts** regularly in the Security tab

5. **Keep dependencies updated** by reviewing the weekly security workflow results
