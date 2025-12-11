# Demo Errors Introduced

This document tracks the intentional errors introduced for the autonomous agent demo.

## Error 1: Pipeline Configuration Error ✅

**File**: `.planton/pipeline.yaml`  
**Line**: 85  
**Error Type**: Invalid field name in Tekton taskSpec

**What was changed**:
```yaml
# Before (correct):
taskSpec:
  workspaces:    # Plural - correct
    - name: source

# After (broken):
taskSpec:
  workspace:     # Singular - INVALID!
    - name: source
```

**Error Details**:
- Changed `workspaces:` (plural) to `workspace:` (singular) in npm-build task
- This is an invalid field in Tekton Pipeline v1 spec
- Will cause pipeline validation or execution failure
- Error message will likely be: "unknown field: workspace" or similar

**Pipeline Impact**:
- Pipeline will fail during task execution or validation
- Build logs will show Tekton error about invalid field
- Agent must analyze error, identify typo, and fix the YAML

**Why this error**:
- Common mistake when writing Tekton pipelines
- Tests agent's ability to fix infrastructure/configuration errors (not just code)
- Demonstrates agent can handle both code and pipeline fixes

**Commit**: `4a0313a` - "test: introduce pipeline error for agent demo"

---

## Error 2: Code Error (To be introduced in Phase 3)

**File**: `server.js`  
**Line**: 1  
**Error Type**: Missing import/require statement

**What to change**:
```javascript
// Before (correct):
const express = require('express');
const app = express();

// After (broken):
// const express = require('express');  // Comment out
const app = express();
```

**Error Details**:
- Comment out `const express = require('express');`
- Will cause: `ReferenceError: express is not defined`
- Fails during npm-build task (node -c server.js)
- Classic JavaScript runtime error

**Why this error**:
- Simple, clear error for initial demo
- Easy to identify from logs
- Demonstrates code-level fixes

---

## Agent's Challenge

The autonomous troubleshooting agent must:

1. **Detect the failure**:
   - Query pipeline status
   - Identify it failed

2. **Analyze logs**:
   - Fetch complete build logs
   - Parse Tekton error messages
   - Identify: "unknown field: workspace"

3. **Understand the fix**:
   - Recognize this is a Tekton YAML schema error
   - Know that `workspace:` should be `workspaces:` (plural)

4. **Clone repository**:
   - Get GitHub credential
   - Get installation token
   - Clone using token

5. **Fix the error**:
   - Edit `.planton/pipeline.yaml`
   - Change `workspace:` back to `workspaces:`
   - Verify no other errors

6. **Create PR**:
   - Create branch: `fix/pipeline-workspace-typo-YYYYMMDD`
   - Commit with message: "fix: correct workspace field to workspaces in npm-build task"
   - Push branch
   - Create PR with detailed description

7. **Report back**:
   - Return PR URL
   - Explain the error and fix

---

## Testing Strategy

### Scenario 1: Pipeline Error Only
- **Current State**: Pipeline error committed (✅)
- **Expected**: Agent fixes pipeline YAML
- **Tests**: Agent's ability to handle infrastructure/config errors

### Scenario 2: Code Error Only (Future)
- **Setup**: Revert pipeline fix, introduce code error
- **Expected**: Agent fixes JavaScript code
- **Tests**: Agent's ability to handle code errors

### Scenario 3: Both Errors (Advanced)
- **Setup**: Both errors present simultaneously
- **Expected**: Agent fixes both in single PR
- **Tests**: Agent's ability to handle multiple error types

---

## Error Timeline

1. ✅ **Commit 881ddbf**: Initial working code and pipeline
2. ✅ **Commit 4a0313a**: Introduced pipeline error (workspace typo)
3. ⏳ **Next**: Service onboarding to trigger pipeline
4. ⏳ **Then**: Agent execution to fix error
5. ⏳ **Future**: Introduce code error for second demo

---

## Expected Pipeline Failure

When the pipeline runs with this error, expect:

**Build Stage**: FAILED  
**Task**: npm-build  
**Error**: 
```
error validating taskrun spec: invalid value: unknown field "workspace"
```

Or during execution:
```
error: TaskRun validation failed: spec.taskSpec.workspace: field not found
```

The exact error message depends on Tekton version, but will clearly indicate the invalid field.

---

## Agent Success Criteria

The agent successfully completes the demo when:

- ✅ Identifies the pipeline error from logs
- ✅ Correctly diagnoses the typo (workspace vs workspaces)
- ✅ Clones repository using GitHub token
- ✅ Edits `.planton/pipeline.yaml` with correct fix
- ✅ Creates meaningful commit message
- ✅ Creates professional PR with:
  - Clear title explaining the fix
  - Detailed description of error found
  - Root cause analysis
  - Link to failed pipeline
- ✅ Returns PR URL to user
- ✅ PR merge results in successful pipeline

---

## Repository State

**Current Branch**: main  
**Latest Commit**: 4a0313a (pipeline error)  
**Status**: Ready for service onboarding  
**Next Step**: Apply service manifest to Planton Cloud

**Files with Errors**:
- ✅ `.planton/pipeline.yaml` - Line 85: `workspace:` should be `workspaces:`

**Files Ready**:
- ✅ `package.json`
- ✅ `server.js` (currently working - no error yet)
- ✅ `Dockerfile`
- ✅ `README.md`
- ✅ `.gitignore`

---

## Demo Presentation Notes

**Show the error in pipeline.yaml**:
- Point out line 85: `workspace:` (singular)
- Explain this is invalid Tekton syntax
- Show it should be `workspaces:` (plural)

**Explain why this is interesting**:
- "Not just fixing code - the agent fixes infrastructure configuration"
- "This demonstrates true DevOps automation"
- "Agent understands Tekton pipeline syntax"

**Highlight agent capabilities**:
- Parses YAML
- Understands Tekton schema
- Makes targeted fixes
- Handles configuration and code errors

---

**Status**: Pipeline error committed ✅  
**Ready for**: Service onboarding and agent testing 🚀




