# Setup Instructions for Hello World Service Demo

## Phase 1: Create GitHub Repository

Follow these steps to create the repository and push the initial code:

### Step 1: Create GitHub Repository

1. Go to GitHub: https://github.com/new
2. Repository name: `hello-world-service-demo`
3. Owner: `sureshattaluri`
4. Description: "Simple Node.js Express service for autonomous agent demo"
5. Visibility: **Public** (or Private if preferred)
6. **DO NOT** initialize with README, .gitignore, or license (we have them already)
7. Click "Create repository"

### Step 2: Initialize and Push Code

Run these commands from the `/tmp/hello-world-service-demo` directory:

```bash
cd /tmp/hello-world-service-demo

# Initialize git repository
git init

# Add all files
git add .

# Initial commit
git commit -m "feat: initial hello world service with Tekton pipeline"

# Add remote (replace with your actual repository URL)
git remote add origin https://github.com/sureshattaluri/hello-world-service-demo.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Verify Repository

1. Visit: https://github.com/sureshattaluri/hello-world-service-demo
2. Verify all files are present:
   - package.json
   - server.js
   - Dockerfile
   - .planton/pipeline.yaml
   - README.md
   - .gitignore

### Step 4: Test Locally (Optional)

```bash
cd /tmp/hello-world-service-demo

# Install dependencies
npm install

# Run the server
npm start

# In another terminal, test endpoints:
curl http://localhost:3000/health
curl http://localhost:3000/
```

## Next Steps

After completing Phase 1, proceed to:
- **Phase 2**: Onboard service to Planton Cloud (blueberry-labs organization)
- **Phase 3**: Introduce syntax error and verify pipeline failure
- **Phase 4**: Create and test autonomous troubleshooting agent

---

## Phase 1 Checklist

- [ ] GitHub repository created at github.com/sureshattaluri/hello-world-service-demo
- [ ] All files pushed to main branch
- [ ] Repository is accessible
- [ ] (Optional) Service tested locally and working

