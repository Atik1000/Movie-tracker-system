# Docker Deployment Guide

This document provides detailed instructions for deploying the Movie Tracker System using Docker.

## 📦 What's Included

- **Dockerfile** - Multi-stage production build
- **docker-compose.yml** - Production deployment configuration
- **docker-compose.dev.yml** - Development mode with hot reload
- **.dockerignore** - Optimized build context
- **Makefile** - Convenient command shortcuts

## 🚀 Quick Start

### 1. Set Environment Variables

```bash
cp .env.local.example .env
```

Edit `.env` and add your TMDB API key:
```
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
```

### 2. Start the Application

**Option A: Using Docker Compose**
```bash
docker-compose up -d
```

**Option B: Using Makefile**
```bash
make up
```

The application will be available at http://localhost:3000

## 🔧 Development Mode

For local development with hot reload:

```bash
# Using docker-compose
docker-compose -f docker-compose.dev.yml up

# Or using Makefile
make dev
```

Changes to your code will be reflected immediately without rebuilding.

## 📋 Available Commands

### Docker Compose Commands

```bash
# Start production
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and start
docker-compose up -d --build

# Restart containers
docker-compose restart
```

### Makefile Commands

```bash
make help       # Show all available commands
make build      # Build Docker image
make up         # Start production
make down       # Stop containers
make restart    # Restart containers
make logs       # View logs
make dev        # Start dev mode
make clean      # Remove all Docker resources
make test       # Run tests in container
```

## 🏗️ Build Process

The Dockerfile uses a multi-stage build for optimal image size:

1. **Stage 1 (deps)**: Install dependencies
2. **Stage 2 (builder)**: Build the Next.js application
3. **Stage 3 (runner)**: Create minimal runtime image

This results in a production image of ~150MB.

## 🔐 Security Features

- Runs as non-root user (nextjs:nodejs)
- Minimal Alpine Linux base image
- No unnecessary build tools in final image
- Health check monitoring

## 🌐 Deployment Options

### Cloud Platforms

**AWS ECS/Fargate**
```bash
# Build and push to ECR
aws ecr get-login-password --region region | docker login --username AWS --password-stdin account-id.dkr.ecr.region.amazonaws.com
docker build -t movie-tracker .
docker tag movie-tracker:latest account-id.dkr.ecr.region.amazonaws.com/movie-tracker:latest
docker push account-id.dkr.ecr.region.amazonaws.com/movie-tracker:latest
```

**Google Cloud Run**
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/project-id/movie-tracker
gcloud run deploy movie-tracker --image gcr.io/project-id/movie-tracker --platform managed
```

**Azure Container Instances**
```bash
# Build and push to ACR
az acr build --registry myregistry --image movie-tracker .
az container create --resource-group myResourceGroup --name movie-tracker --image myregistry.azurecr.io/movie-tracker --dns-name-label movie-tracker --ports 3000
```

**DigitalOcean App Platform**
- Connect your GitHub repository
- Choose "Dockerfile" as build method
- Set environment variables in the dashboard
- Deploy!

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
docker-compose up -d -p 3001:3000
```

### Build Fails
```bash
# Clean Docker cache and rebuild
docker system prune -a
docker-compose build --no-cache
```

### Container Won't Start
```bash
# Check logs
docker-compose logs

# Check container status
docker ps -a

# Inspect container
docker inspect movie-tracker-app
```

### Permission Issues
```bash
# Ensure correct ownership
sudo chown -R $USER:$USER .

# Or run with sudo (not recommended)
sudo docker-compose up -d
```

## 📊 Resource Usage

**Typical Resource Requirements:**
- CPU: 0.5 vCPU
- Memory: 512MB - 1GB
- Disk: 200MB
- Network: Port 3000

## ✅ Health Checks

The container includes automatic health monitoring:
- **Interval**: Every 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3 attempts
- **Start Period**: 40 seconds

Check health status:
```bash
docker inspect --format='{{.State.Health.Status}}' movie-tracker-app
```

## 🔄 Updates and Maintenance

### Update to Latest Code
```bash
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### View Resource Usage
```bash
docker stats movie-tracker-app
```

### Backup Data
Since the app uses localStorage, no database backup is needed. However, you can backup the container state:
```bash
docker commit movie-tracker-app movie-tracker-backup
```

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_TMDB_API_KEY` | Yes | Your TMDB API key |
| `NODE_ENV` | No | Environment mode (production/development) |
| `PORT` | No | Server port (default: 3000) |
| `HOSTNAME` | No | Server hostname (default: 0.0.0.0) |

## 🤝 Support

For issues related to:
- **Docker**: Check [Docker documentation](https://docs.docker.com/)
- **Next.js**: Check [Next.js documentation](https://nextjs.org/docs)
- **This project**: Open an issue on GitHub
