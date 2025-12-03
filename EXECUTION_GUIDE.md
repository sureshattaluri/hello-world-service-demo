# Autonomous Agent Demo - Execution Guide

This guide walks you through setting up and executing the autonomous pipeline troubleshooting agent demo.

## Overview

The demo consists of 4 phases:
1. **Phase 1**: Create GitHub repository (files ready in `/tmp/hello-world-service-demo`)
2. **Phase 2**: Onboard service to Planton Cloud (manifest created)
3. **Phase 3**: Introduce pipeline error and verify failure (manual)
4. **Phase 4**: Test autonomous troubleshooting agent (manifest created)

## Phase 1: Create GitHub Repository

### Step 1.1: Create Repository on GitHub

1. Go to: https://github.com/new
2. Settings:
   - Owner: `sureshattaluri`
   - Repository name: `hello-world-service-demo`
   - Description: "Simple Node.js Express service for autonomous agent demo"
   - Visibility: Public
   - **Do NOT initialize** with README, .gitignore, or license
3. Click "Create repository"

### Step 1.2: Push Code to GitHub

```bash
cd /tmp/hello-world-service-demo

# Initialize git
git init

# Add all files
git add .

# Initial commit
git commit -m "feat: initial hello world service with Tekton pipeline"

# Add remote
git remote add origin https://github.com/sureshattaluri/hello-world-service-demo.git

# Push to main
git branch -M main
git push -u origin main
```

### Step 1.3: Verify

Visit https://github.com/sureshattaluri/hello-world-service-demo and confirm all files are present.

✅ **Phase 1 Complete**

---

## Phase 2: Onboard Service to Planton Cloud

### Step 2.1: Verify Prerequisites

Ensure:
- [ ] Blueberry-labs organization exists in Planton Cloud
- [ ] You have access to create services in blueberry-labs
- [ ] GitHub credential is configured for the organization
- [ ] Planton CLI is installed and authenticated

### Step 2.2: Apply Service Manifest

The service manifest has been created at:
`planton-cloud/ops/organizations/blueberry-labs/services/hello-world-service-demo.yaml`

Apply it:

```bash
cd /Users/suresh/scm/github.com/plantoncloud-inc/planton-cloud

# Apply the service manifest
planton apply -f ops/organizations/blueberry-labs/services/hello-world-service-demo.yaml
```

### Step 2.3: Verify Service Creation

1. Check CLI output for success message
2. Verify in web console:
   - Navigate to blueberry-labs organization
   - Check Services section
   - Confirm "hello-world-service-demo" appears
3. Verify GitHub webhook:
   - Go to: https://github.com/sureshattaluri/hello-world-service-demo/settings/hooks
   - Confirm Planton Cloud webhook is configured

### Step 2.4: Wait for Initial Pipeline

The service creation should trigger an initial pipeline run. Wait for it to complete.

Expected: **Pipeline should SUCCEED** (code has no errors yet)

✅ **Phase 2 Complete**

---

## Phase 3: Introduce Pipeline Error

Now we'll intentionally break the code to simulate a real-world scenario the agent will fix.

### Step 3.1: Clone Repository Locally

```bash
cd ~/projects  # or wherever you keep projects
git clone https://github.com/sureshattaluri/hello-world-service-demo.git
cd hello-world-service-demo
```

### Step 3.2: Introduce Syntax Error

Edit `server.js` and **remove** the express import line:

**Original (working):**
```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
```

**Modified (broken):**
```javascript
// const express = require('express');  // <-- Comment out this line
const app = express();
const PORT = process.env.PORT || 3000;
```

This will cause: `ReferenceError: express is not defined`

### Step 3.3: Commit and Push

```bash
git add server.js
git commit -m "test: remove express import to test pipeline failure"
git push origin main
```

### Step 3.4: Verify Pipeline Failure

1. Push triggers webhook → pipeline starts automatically
2. Watch in Planton Cloud web console:
   - Navigate to Services → hello-world-service-demo
   - Click on latest Pipeline execution
   - Wait for pipeline to fail (should fail in npm-build or docker-build task)

3. Capture the pipeline ID:
   - Note the pipeline ID from the web console (e.g., `pipe_01xxxxx`)
   - Or get it via CLI:
     ```bash
     planton get pipelines --service hello-world-service-demo --org blueberry-labs
     ```

4. Verify logs show the error:
   ```bash
   planton get pipeline-logs <pipeline-id>
   ```
   
   Should see: `ReferenceError: express is not defined`

✅ **Phase 3 Complete** - Pipeline is now failing!

---

## Phase 4: Test Autonomous Troubleshooting Agent

### Step 4.1: Apply Agent Manifest

The agent manifest has been created at:
`planton-cloud/ops/organizations/blueberry-labs/agent-fleet/pipeline-troubleshooter.yaml`

Apply it:

```bash
cd /Users/suresh/scm/github.com/plantoncloud-inc/planton-cloud

# Apply the agent manifest
planton apply -f ops/organizations/blueberry-labs/agent-fleet/pipeline-troubleshooter.yaml
```

### Step 4.2: Verify Agent Creation

Check in web console:
- Navigate to blueberry-labs organization
- Go to Agent Fleet section
- Confirm "pipeline-troubleshooter" agent is listed

### Step 4.3: Execute the Agent

**Option A: Via CLI**
```bash
planton agent execute pipeline-troubleshooter \
  --org blueberry-labs \
  --input "Fix the failed build for hello-world-service-demo"
```

**Option B: Via Web Console**
1. Navigate to Agent Fleet → pipeline-troubleshooter
2. Click "Execute"
3. Enter message: "Fix the failed build for hello-world-service-demo"
4. Click "Run"

### Step 4.4: Watch the Agent Work

The agent will:
1. ✓ Query service details using MCP tool `get_service_by_org_by_slug`
2. ✓ Get pipeline status using `get_pipeline_by_id`
3. ✓ Fetch build logs using `get_pipeline_build_logs`
4. ✓ Analyze logs and identify: "express is not defined"
5. ✓ Get GitHub credential using `get_github_credential_for_service`
6. ✓ Clone repo in sandbox: `git clone ...`
7. ✓ Read server.js and identify missing import
8. ✓ Fix the code: uncomment `const express = require('express');`
9. ✓ Create branch: `git checkout -b fix/missing-express-import-20251203`
10. ✓ Commit: `git commit -m "fix: add missing express import"`
11. ✓ Push: `git push origin fix/missing-express-import-20251203`
12. ✓ Create PR: `gh pr create --title "..." --body "..."`
13. ✓ Return PR URL to user

### Step 4.5: Verify Results

The agent should return a message like:

```
✅ Pipeline fix completed successfully!

Pull Request Created: https://github.com/sureshattaluri/hello-world-service-demo/pull/1

Title: Fix: Add missing express import causing build failure

Summary:
- Identified error: ReferenceError: express is not defined
- Root cause: Missing require statement for express module
- Fix applied: Added const express = require('express'); at line 1
- Branch: fix/missing-express-import-20251203

The pull request includes:
- Detailed error analysis from build logs
- Minimal code change (1 line)
- Link to failed pipeline execution
- Ready to merge
```

### Step 4.6: Review the PR

1. Visit the PR URL
2. Verify PR contents:
   - ✅ Professional title
   - ✅ Detailed description with error analysis
   - ✅ Root cause explanation
   - ✅ Link to failed pipeline
   - ✅ Minimal, correct code change
   - ✅ Only adds the missing line back

3. (Optional) Merge the PR to verify fix works

✅ **Phase 4 Complete** - Autonomous agent successfully fixed the pipeline!

---

## Demo Presentation Tips

### Pre-Demo Checklist

- [ ] Service is onboarded and visible in blueberry-labs
- [ ] Pipeline is failing with clear error
- [ ] Agent is deployed and accessible
- [ ] Web console is open and ready to share screen
- [ ] Terminal is ready for CLI commands

### Presentation Flow (7-8 minutes)

**1. Setup Context (1 min)**
- Show failed pipeline in web console
- Click into pipeline logs
- Highlight the error: "express is not defined"
- Explain: "This is a common issue - someone committed broken code"

**2. Introduce the Agent (30 sec)**
- "Instead of manually debugging, let's use our autonomous agent"
- Show agent in Agent Fleet
- Explain: "This agent has MCP tools for Planton Cloud APIs and sandbox access for GitHub"

**3. Execute Agent (30 sec)**
- Run: `planton agent execute pipeline-troubleshooter --org blueberry-labs --input "Fix the failed build for hello-world-service-demo"`
- "Now watch the agent work autonomously..."

**4. Show Agent Working (3-4 min - live)**
- Point out MCP tool calls in the execution log
- Highlight: "It's querying our APIs, analyzing logs, cloning the repo"
- Show sandbox activity: "Making changes in an isolated environment"
- Build tension: "Will it correctly identify the issue?"

**5. Review Results (2 min)**
- Agent returns PR URL
- Open the PR on screen
- Show professional PR description
- Show the fix (one line added back)
- Emphasize: "No human in the loop - completely autonomous"

**6. Closing Points (1 min)**
- "This goes way beyond CRUD operations on cloud resources"
- "Same framework can handle infrastructure issues, code reviews, security fixes"
- "Combines reasoning (LLM) + access (MCP tools) + execution (sandbox)"
- "This is the future of DevOps automation"

### Key Points to Emphasize

✨ **Autonomous**: Zero human intervention from detection to PR creation  
🔧 **Production-Ready**: Real GitHub, real code, real PRs  
🚀 **Extensible**: Pattern applies to many troubleshooting scenarios  
🎯 **Accurate**: Minimal, targeted fixes based on log analysis  
💡 **Intelligent**: Combines multiple tools and reasoning to solve problems  

---

## Troubleshooting

### Issue: Service creation fails

**Check:**
- blueberry-labs organization exists
- You have proper permissions
- GitHub credential is configured

**Fix:**
```bash
# List organizations
planton get organizations

# Check credentials
planton get github-credentials --org blueberry-labs
```

### Issue: Pipeline doesn't trigger

**Check:**
- Webhook is configured on GitHub
- Service shows webhook_id in the manifest

**Fix:**
- Manually trigger: `planton trigger-pipeline --service hello-world-service-demo --org blueberry-labs`

### Issue: Agent can't clone repository

**Check:**
- GitHub credential has repo access
- Repository is accessible
- Credential is linked to service

**Fix:**
- Verify credential scope includes repo access
- Re-create GitHub credential if needed

### Issue: Agent creates wrong fix

**Refine:**
- Update agent instructions with more specific patterns
- Add examples of common errors and fixes
- Adjust MCP tool selection

---

## Files Created

### Phase 1 Files (in /tmp/hello-world-service-demo/)
- `package.json` - Node.js dependencies
- `server.js` - Express application
- `Dockerfile` - Container build
- `.planton/pipeline.yaml` - Tekton pipeline
- `README.md` - Service documentation
- `.gitignore` - Git ignore rules
- `SETUP_INSTRUCTIONS.md` - Setup guide
- `EXECUTION_GUIDE.md` - This file

### Phase 2 Files (in planton-cloud repo)
- `ops/organizations/blueberry-labs/services/hello-world-service-demo.yaml`

### Phase 4 Files (in planton-cloud repo)
- `ops/organizations/blueberry-labs/agent-fleet/pipeline-troubleshooter.yaml`

---

## Success Criteria

- [ ] Repository created and pushed to GitHub
- [ ] Service onboarded to Planton Cloud
- [ ] Initial pipeline succeeds
- [ ] Error introduced, pipeline fails
- [ ] Failed pipeline logs show clear error
- [ ] Agent deployed successfully
- [ ] Agent execution completes without errors
- [ ] PR created with correct fix
- [ ] PR has professional title and description
- [ ] Code change is minimal and correct
- [ ] Demo ready to present to team

---

## Next Steps After Demo

If the demo is successful, consider:

1. **Expand error patterns**: Train agent to fix more error types
2. **Add test generation**: Agent creates tests for fixes
3. **Multi-file fixes**: Handle errors spanning multiple files
4. **Integration tests**: Verify fix works before creating PR
5. **Auto-merge**: Automatically merge if CI passes
6. **Proactive monitoring**: Agent watches for failures and auto-fixes

The foundation is in place for a powerful autonomous DevOps assistant!

---

Good luck with the demo! 🚀

