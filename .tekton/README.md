# Tekton Pipeline for hello-world-service-demo

This directory contains the Tekton CI/CD pipeline definition for the hello-world-service-demo service.

## Pipeline Overview

The pipeline automates the build, test, and container image creation process for this Node.js Express application.

### Pipeline Tasks

1. **git-checkout** - Clones the source code repository
   - Uses Tekton Hub `git-clone` task v0.9
   - Configurable git URL and revision (branch/tag/commit)

2. **npm-test** - Installs dependencies and runs tests
   - Uses Node.js 18 Alpine image
   - Runs `npm ci` to install dependencies
   - Executes `npm test` to run test suite

3. **build-and-push-image** - Builds and pushes container image
   - Uses Tekton Hub `kaniko` task v0.7
   - Builds Docker image using the Dockerfile
   - Pushes image to container registry
   - Includes caching for faster builds

### Pipeline Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `git-url` | Git repository URL | `https://github.com/sureshattaluri/hello-world-service-demo.git` |
| `git-revision` | Git revision (branch/tag/sha) | `main` |
| `image-name` | Fully qualified image name | (required) |
| `dockerfile-path` | Path to Dockerfile | `./Dockerfile` |
| `context-path` | Build context path | `.` |

### Workspaces

- **source** - Workspace for source code and build artifacts
- **dockerconfig** - Docker registry credentials (optional)

## Running the Pipeline

### Prerequisites

- Tekton Pipelines installed in your Kubernetes cluster
- Docker registry credentials configured
- PersistentVolumeClaim for the source workspace

### Example PipelineRun

```yaml
apiVersion: tekton.dev/v1
kind: PipelineRun
metadata:
  name: hello-world-service-demo-run-1
spec:
  pipelineRef:
    name: hello-world-service-demo-pipeline
  params:
    - name: git-url
      value: https://github.com/sureshattaluri/hello-world-service-demo.git
    - name: git-revision
      value: main
    - name: image-name
      value: your-registry.io/hello-world-service-demo:latest
  workspaces:
    - name: source
      volumeClaimTemplate:
        spec:
          accessModes:
            - ReadWriteOnce
          resources:
            requests:
              storage: 1Gi
    - name: dockerconfig
      secret:
        secretName: docker-credentials
```

### Using tkn CLI

```bash
# Create a pipeline run with tkn
tkn pipeline start hello-world-service-demo-pipeline \
  --param git-url=https://github.com/sureshattaluri/hello-world-service-demo.git \
  --param git-revision=main \
  --param image-name=your-registry.io/hello-world-service-demo:latest \
  --workspace name=source,volumeClaimTemplateFile=workspace-template.yaml \
  --workspace name=dockerconfig,secret=docker-credentials \
  --showlog
```

## Pipeline Features

- ✅ **Automated Testing** - Runs npm tests before building image
- ✅ **Container Image Building** - Uses Kaniko for secure, rootless builds
- ✅ **Build Caching** - Speeds up subsequent builds
- ✅ **Parameterized** - Flexible configuration via parameters
- ✅ **Hub Integration** - Uses verified tasks from Tekton Hub

## Planton Cloud Integration

This pipeline follows Planton Cloud best practices:

- Uses Kaniko instead of docker build/push for security
- Handles authentication automatically via Kubernetes service account
- Optimized for cloud-native deployments
- Compatible with Planton Cloud pipeline orchestration

## Troubleshooting

### Pipeline Fails at npm-test

- Check that `package.json` has valid test script
- Verify dependencies are correctly specified
- Review build logs: `tkn pipelinerun logs <pipelinerun-name>`

### Image Push Fails

- Verify docker registry credentials are correct
- Check image name format: `registry/repository:tag`
- Ensure service account has access to dockerconfig secret

### Git Clone Fails

- Verify git URL is accessible
- Check if repository requires authentication
- Ensure git-revision (branch/tag) exists

## References

- [Tekton Pipelines Documentation](https://tekton.dev/docs/pipelines/)
- [Tekton Hub](https://hub.tekton.dev/)
- [Kaniko Documentation](https://github.com/GoogleContainerTools/kaniko)
