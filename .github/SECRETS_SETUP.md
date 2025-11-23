# GitHub Secrets Setup Guide

This guide will help you configure all necessary secrets for the CI/CD pipeline.

## 🔐 Required Secrets

### Access GitHub Secrets Settings

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each secret below

---

## Core Secrets (Required)

### 1. Database Secrets

#### `STAGING_POSTGRES_URL`
**Description**: PostgreSQL connection string for staging environment
**Format**: `postgres://username:password@host:port/database`
**Example**: `postgres://staging_user:pass123@db-staging.example.com:5432/investors_staging`

#### `PRODUCTION_POSTGRES_URL`
**Description**: PostgreSQL connection string for production environment
**Format**: `postgres://username:password@host:port/database`
**Example**: `postgres://prod_user:securepass@db-prod.example.com:5432/investors_prod`

**How to get:**
- **Local/Self-hosted**: Use your PostgreSQL server credentials
- **Neon**: Get from Neon dashboard → Connection string
- **Supabase**: Get from Supabase dashboard → Database settings
- **Railway**: Get from Railway dashboard → PostgreSQL service
- **AWS RDS**: Get from RDS console → Connectivity & security

---

### 2. Authentication Secrets

#### `STAGING_BETTER_AUTH_SECRET`
**Description**: Secret key for Better Auth in staging
**Format**: Base64 string (32+ characters)
**Generate**:
```bash
openssl rand -base64 32
```
**Example**: `ffYvE2+qPW6L/PhZgoXl6zZR0n634p8y+BQf+bE98BQ=`

#### `PRODUCTION_BETTER_AUTH_SECRET`
**Description**: Secret key for Better Auth in production
**Format**: Base64 string (32+ characters)
**Generate**:
```bash
openssl rand -base64 32
```
**⚠️ Important**: Use a different secret for production than staging!

---

### 3. LLM API Keys

#### `GROQ_API_KEY`
**Description**: API key for Groq AI services
**Get from**: https://console.groq.com/keys
**Example**: `gsk_...`
**Cost**: Free tier available

#### `OPENAI_API_KEY` (Optional)
**Description**: API key for OpenAI services
**Get from**: https://platform.openai.com/api-keys
**Example**: `sk-...`
**Cost**: Pay-as-you-go

#### `ANTHROPIC_API_KEY` (Optional)
**Description**: API key for Anthropic Claude
**Get from**: https://console.anthropic.com/
**Example**: `sk-ant-...`
**Cost**: Pay-as-you-go

---

## Deployment Secrets (Choose One Method)

### Option 1: Docker + SSH Deployment

#### `STAGING_HOST`
**Description**: Staging server hostname or IP
**Example**: `staging.yourdomain.com` or `192.168.1.100`

#### `STAGING_SSH_USER`
**Description**: SSH username for staging server
**Example**: `deploy` or `ubuntu`

#### `STAGING_SSH_KEY`
**Description**: Private SSH key for staging server
**Format**: Full private key including headers
**Generate**:
```bash
ssh-keygen -t ed25519 -C "github-actions-staging"
cat ~/.ssh/id_ed25519
```
**Example**:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
...
-----END OPENSSH PRIVATE KEY-----
```

#### `PRODUCTION_HOST`
**Description**: Production server hostname or IP
**Example**: `yourdomain.com` or `192.168.1.200`

#### `PRODUCTION_SSH_USER`
**Description**: SSH username for production server
**Example**: `deploy`

#### `PRODUCTION_SSH_KEY`
**Description**: Private SSH key for production server
**Generate**: Same as staging, but use different key

---

### Option 2: Vercel Deployment

#### `VERCEL_TOKEN`
**Description**: Vercel deployment token
**Get from**: https://vercel.com/account/tokens
**Steps**:
1. Go to Vercel Account Settings
2. Click **Tokens**
3. Create new token named "GitHub Actions"
4. Copy and save as secret

---

### Option 3: Railway Deployment

#### `RAILWAY_TOKEN`
**Description**: Railway CLI token
**Get from**: https://railway.app/account/tokens
**Steps**:
1. Go to Railway Account Settings
2. Click **Tokens**
3. Create new token
4. Copy and save as secret

#### `STAGING_RAILWAY_URL`
**Description**: Railway staging app URL
**Example**: `https://investors-staging.up.railway.app`

#### `PRODUCTION_RAILWAY_URL`
**Description**: Railway production app URL
**Example**: `https://investors-prod.up.railway.app`

---

## Optional Secrets

### Docker Hub (for public Docker images)

#### `DOCKERHUB_USERNAME`
**Description**: Your Docker Hub username
**Example**: `yourname`

#### `DOCKERHUB_TOKEN`
**Description**: Docker Hub access token
**Get from**: https://hub.docker.com/settings/security
**Steps**:
1. Go to Docker Hub → Account Settings → Security
2. Click **New Access Token**
3. Name it "GitHub Actions"
4. Copy and save as secret

---

### E2B Sandbox (for secure data processing)

#### `E2B_API_KEY`
**Description**: E2B sandbox API key
**Get from**: https://e2b.dev/dashboard
**Used for**: Secure investor data processing

---

### OAuth Providers (for social login)

#### `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
**Get from**: https://console.cloud.google.com/
**Steps**: Create OAuth 2.0 credentials for web application

#### `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`
**Get from**: https://github.com/settings/developers
**Steps**: Register new OAuth application

#### `MICROSOFT_CLIENT_ID` & `MICROSOFT_CLIENT_SECRET`
**Get from**: https://portal.azure.com/
**Steps**: Register app in Azure AD

---

## 📋 Setup Checklist

Use this checklist to ensure all secrets are configured:

### Required for CI/CD to work:
- [ ] `STAGING_POSTGRES_URL`
- [ ] `STAGING_BETTER_AUTH_SECRET`
- [ ] `PRODUCTION_POSTGRES_URL`
- [ ] `PRODUCTION_BETTER_AUTH_SECRET`
- [ ] `GROQ_API_KEY` (or another LLM provider key)

### Required for deployment (choose one):
- [ ] **Docker**: `STAGING_HOST`, `STAGING_SSH_USER`, `STAGING_SSH_KEY`
- [ ] **Vercel**: `VERCEL_TOKEN`
- [ ] **Railway**: `RAILWAY_TOKEN`, `STAGING_RAILWAY_URL`

### Optional:
- [ ] `DOCKERHUB_USERNAME` & `DOCKERHUB_TOKEN` (for public Docker images)
- [ ] `E2B_API_KEY` (for secure sandbox features)
- [ ] OAuth secrets (for social login)

---

## 🔒 Security Best Practices

1. **Never commit secrets to git**
   - Secrets should only be in GitHub Secrets, never in code
   - The `.env` file is gitignored - keep it that way

2. **Use different secrets for staging and production**
   - Never reuse production secrets in staging
   - Rotate secrets regularly

3. **Limit secret access**
   - Only add secrets that are actually needed
   - Remove secrets that are no longer used

4. **Rotate secrets periodically**
   - Change database passwords every 90 days
   - Regenerate API keys annually
   - Update SSH keys when team members leave

5. **Monitor secret usage**
   - Check GitHub Actions logs for unauthorized access
   - Enable audit logging for sensitive operations

---

## 🧪 Testing Secrets

After adding secrets, test them:

1. **Test database connection:**
   ```bash
   PGPASSWORD='your_password' psql -h host -U username -d database -c "SELECT 1"
   ```

2. **Test API keys:**
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" https://api-endpoint.com/test
   ```

3. **Test SSH access:**
   ```bash
   ssh -i ~/.ssh/key user@host "echo 'Connection successful'"
   ```

---

## 🆘 Troubleshooting

### "Secret not found" error
- Verify secret name matches exactly (case-sensitive)
- Check secret is set at repository level, not organization level

### "Invalid database URL" error
- Verify connection string format: `postgres://user:pass@host:port/db`
- Test connection locally first
- Check firewall rules allow GitHub Actions IPs

### "SSH connection failed" error
- Verify SSH key includes full content with headers/footers
- Check server allows key-based authentication
- Verify user has proper permissions

### "API key invalid" error
- Verify API key hasn't expired
- Check key has necessary permissions
- Test key with curl before adding to secrets

---

## 📞 Getting Help

- **GitHub Secrets Documentation**: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Project Issues**: https://github.com/AntoineNaccache/Investors-finding-project/issues
- **Workflow Logs**: Check Actions tab for detailed error messages

---

## 🔄 Next Steps

After setting up secrets:

1. ✅ Verify all required secrets are added
2. ✅ Test CI pipeline by creating a pull request
3. ✅ Test deployment by merging to main branch
4. ✅ Monitor first deployment in Actions tab
5. ✅ Set up GitHub Environments for additional protection
