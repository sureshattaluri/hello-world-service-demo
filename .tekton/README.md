# Tekton Pipeline for hello-world-service-demo

This directory contains the Tekton CI/CD pipeline configuration for the hello-world-service-demo Node.js service.

## Pipeline Overview

The pipeline automates the build, test, and containerization process with the following stages:

1. **git-checkout**: Clones the repository using Tekton Hub git-clone task (v0.9)
2. **npm-test**: Installs Node.js dependencies and runs tests
3. **build-image**: Builds and pushes the container image using Kaniko (v0.7)

## Pipeline Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `repo-url` | Git repository URL | `https://github.com/sureshattaluri/hello-world-service-demo.git` |
| `revision` | Git branch, tag, or commit SHA | `main` |
| `image-name` | Full container image name | `gcr.io/planton-cloud/hello-world-service-demo` |
| `image-tag` | Container image tag | `latest` |
| `dockerfile-path` | Path to Dockerfile | `./Dockerfile` |
| `context-path` | Build context path | `.` |

## Workspaces

- **source**: Workspace for cloned repository code
- **package-credentials**: Optional workspace for npm/package credentials

## Tasks Breakdown

### 1. git-checkout
- **Task Reference**: Tekton Hub git-clone v0.9
- **Purpose**: Clones the source code from GitHub
- **Outputs**: Repository files in `source` workspace

### 2. npm-test
- **Purpose**: Install dependencies and run tests
- **Steps**:
  - Install npm dependencies using `npm ci`
  - Run test suite with `npm test`
- **Image**: node:18-alpine

### 3. build-image
- **Task Reference**: Tekton Hub kaniko v0.7
- **Purpose**: Build and push container image
- **Features**:
  - Multi-stage Docker build
  - Layer caching enabled (24h TTL)
  - Compressed caching for efficiency
  - Uses Kaniko executor v1.23.2

## Usage

### Apply the Pipeline

```bash
kubectl apply -f .tekton/pipeline.yaml
```

### Trigger a Pipeline Run

```bash
kubectl create -f .tekton/pipelinerun.yaml
```

Or use `tkn` CLI:

```bash
tkn pipeline start hello-world-service-demo-pipeline \
  --param repo-url=https://github.com/sureshattaluri/hello-world-service-demo.git \
  --param revision=main \
  --param image-name=gcr.io/planton-cloud/hello-world-service-demo \
  --param image-tag=v1.0.0 \
  --workspace name=source,volumeClaimTemplateFile=workspace-template.yaml \
  --showlog
```

### Monitor Pipeline Run

```bash
# List pipeline runs
tkn pipelinerun list

# View logs
tkn pipelinerun logs <pipelinerun-name> -f

# Describe pipeline run
tkn pipelinerun describe <pipelinerun-name>
```

## Authentication

### Container Registry

Kaniko requires authentication to push images. Configure credentials using a Kubernetes secret:

```bash
# Create docker config secret
kubectl create secret docker-registry docker-credentials \
  --docker-server=gcr.io \
  --docker-username=_json_key \
  --docker-password="$(cat gcp-key.json)"

# Link to service account
kubectl patch serviceaccount default \
  -p '{"secrets": [{"name": "docker-credentials"}]}'
```

### Private Git Repositories

For private repositories, configure Git credentials:

```bash
kubectl create secret generic git-credentials \
  --from-literal=username=<github-username> \
  --from-literal=password=<github-token>
```

## Image Build Details

The pipeline uses Kaniko for building container images with these advantages:

- **No Docker Daemon Required**: Runs in any Kubernetes cluster
- **Secure**: No privileged containers needed
- **Efficient**: Layer caching reduces build times
- **Compatible**: Supports multi-stage Dockerfiles

### Kaniko Configuration

- **Builder Image**: `gcr.io/kaniko-project/executor:v1.23.2`
- **Cache**: Enabled with 24-hour TTL
- **Snapshot Mode**: Redo (for consistency)
- **New Run**: Uses optimized run command

## Troubleshooting

### Pipeline Fails at npm-test

- Check if `package.json` and `package-lock.json` exist
- Verify Node.js version compatibility (requires 18+)
- Review test script in `package.json`

### Image Push Fails

- Verify registry credentials are configured
- Check image name format: `registry/repository:tag`
- Ensure service account has imagePullSecrets

### Clone Fails

- Verify repository URL is correct
- Check if repository is private (needs credentials)
- Ensure network connectivity to GitHub

## CI/CD Integration

This pipeline is designed to integrate with:

- **Planton Cloud**: Automated deployments
- **GitHub Actions**: Trigger on push/PR
- **ArgoCD**: GitOps-based deployments
- **Kubernetes Events**: Event-driven automation

## Customization

### Adding More Tests

Edit the `npm-test` task to add linting, security scans, or integration tests:

```yaml
- name: run-lint
  image: node:18-alpine
  workingDir: $(workspaces.source.path)
  script: |
    #!/bin/sh
    npm run lint
```

### Parallel Execution

Tasks can run in parallel by removing `runAfter` dependencies:

```yaml
- name: security-scan
  # Runs parallel with npm-test
  taskRef:
    name: trivy-scan
```

### Multi-Environment Deployments

Add parameters for different environments:

```yaml
params:
  - name: environment
    type: string
    default: development
```

## Resources

- [Tekton Documentation](https://tekton.dev/docs/)
- [Tekton Hub](https://hub.tekton.dev/)
- [Kaniko Documentation](https://github.com/GoogleContainerTools/kaniko)
- [Planton Cloud Documentation](https://docs.planton.cloud/)

## Support

For issues or questions:
- Check pipeline logs: `tkn pipelinerun logs <name> -f`
- Review Tekton events: `kubectl get events`
- Contact Planton Cloud support
