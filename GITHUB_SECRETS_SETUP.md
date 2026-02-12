# GitHub Secrets Setup for Integration Tests

## Required Secrets

To enable integration tests in the CI/CD pipeline, add these secrets to your GitHub repository:

### 1. Navigate to GitHub Secrets
1. Go to your repository: `https://github.com/AbrahamGyamfi/Agile_Development`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each value below

### 2. Add These Secrets

#### AWS Credentials (from your AWS account)
**Name:** `AWS_ACCESS_KEY_ID`
**Value:** Your AWS Access Key ID
- Get from AWS Console → IAM → Users → Security credentials → Access keys
- Or create new access key if you don't have one

**Name:** `AWS_SECRET_ACCESS_KEY`
**Value:** Your AWS Secret Access Key
- This is shown only once when you create the access key
- Keep it secure!

#### Infrastructure Values (from Terraform outputs)
**Name:** `API_GATEWAY_URL`
**Value:** `https://hlpjm7pf97.execute-api.eu-west-1.amazonaws.com/prod`

**Name:** `COGNITO_USER_POOL_ID`
**Value:** `eu-west-1_NJpDdZ8tp`

**Name:** `COGNITO_CLIENT_ID`
**Value:** `1flmifmtgo2p3bgrfm1g0sv450`

### 3. How to Get AWS Access Keys

**Option A: Using AWS CLI (if configured)**
```bash
cat ~/.aws/credentials
```

**Option B: Create New Access Key**
1. Go to AWS Console → IAM → Users
2. Select your IAM user
3. Go to **Security credentials** tab
4. Click **Create access key**
5. Choose **Command Line Interface (CLI)**
6. Copy both Access Key ID and Secret Access Key
7. **Important:** Save the Secret Access Key immediately (shown only once)

### 4. Test Integration Tests Locally

Before pushing, you can test locally:
```bash
cd lambda
export AWS_REGION=eu-west-1
export API_URL=https://hlpjm7pf97.execute-api.eu-west-1.amazonaws.com/prod
export COGNITO_USER_POOL_ID=eu-west-1_NJpDdZ8tp
export COGNITO_CLIENT_ID=1flmifmtgo2p3bgrfm1g0sv450
npm run test:integration
```

### 5. Verify Setup

Once secrets are added:
1. Push any commit to main branch
2. Check GitHub Actions tab
3. Integration tests should run successfully ✅

### Security Notes
- ⚠️ Never commit AWS credentials to Git
- ⚠️ Use IAM user with minimal required permissions
- ⚠️ Rotate access keys periodically
- ⚠️ Consider using AWS IAM Roles for GitHub Actions (OIDC) for better security

### What Integration Tests Do
- ✅ Test Lambda functions against real DynamoDB
- ✅ Validate API Gateway endpoints
- ✅ Test Cognito authentication flows
- ✅ Run health checks on your backend
- ✅ Ensure task CRUD operations work end-to-end
