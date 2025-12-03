# Hello World Service Demo

A simple Node.js Express application created for demonstrating autonomous agent capabilities in Planton Cloud.

## Overview

This service is a minimal "hello world" application that:
- Provides a `/health` endpoint for health checks
- Returns a simple JSON response at the root endpoint
- Is containerized using Docker
- Has a Tekton pipeline for automated builds

## Purpose

This repository is used to demonstrate an autonomous troubleshooting agent that can:
1. Detect pipeline build failures
2. Analyze build logs
3. Clone the repository
4. Fix code issues
5. Create pull requests with fixes

## Local Development

### Prerequisites

- Node.js 18 or higher
- npm

### Running Locally

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The server will start on port 3000 (or the PORT environment variable if set).

### Testing Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Root endpoint
curl http://localhost:3000/
```

## Docker

### Build

```bash
docker build -t hello-world-service-demo .
```

### Run

```bash
docker run -p 3000:3000 hello-world-service-demo
```

## CI/CD Pipeline

This service uses a Tekton pipeline defined in `.planton/pipeline.yaml` that:
1. Clones the repository
2. Installs npm dependencies
3. Validates the Node.js code
4. Builds a Docker image
5. Pushes the image to a container registry

The pipeline is configured for **build-only** (no deployment stage).

## Planton Cloud Integration

This service is onboarded to Planton Cloud under the `blueberry-labs` organization:
- Pipeline provider: Self-managed
- Pipeline directory: `.planton`
- Image build: Dockerfile
- Deployments: Disabled (build-only)

## License

MIT

