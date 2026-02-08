# 🐳 Docker Quick Reference

## Prerequisites Installation

### macOS
```bash
# Install Docker Desktop
brew install --cask docker
```

### Ubuntu/Debian
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Windows
Download Docker Desktop from: https://www.docker.com/products/docker-desktop

---

## 🚀 Quick Start

```bash
# 1. Clone and enter directory
cd Movie-tracker-system

# 2. Set up environment
cp .env.local.example .env
# Edit .env and add your TMDB API key

# 3. Test setup (optional)
./docker-test.sh

# 4. Start application
docker-compose up -d

# 5. Open in browser
open http://localhost:3000
```

---

## 📋 Essential Commands

### Production Mode

```bash
# Start containers (detached)
docker-compose up -d

# Start and rebuild
docker-compose up -d --build

# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f

# Restart
docker-compose restart
```

### Development Mode

```bash
# Start dev mode with hot reload
docker-compose -f docker-compose.dev.yml up

# Stop dev mode
docker-compose -f docker-compose.dev.yml down
```

### Makefile Shortcuts

```bash
make help       # Show all commands
make build      # Build image
make up         # Start production
make down       # Stop containers
make logs       # View logs
make dev        # Start dev mode
make clean      # Clean everything
make restart    # Restart containers
```

---

## 🔍 Monitoring & Debugging

```bash
# Check running containers
docker ps

# Check all containers
docker ps -a

# View resource usage
docker stats movie-tracker-app

# Check logs
docker logs movie-tracker-app

# Follow logs live
docker logs -f movie-tracker-app

# Check health status
docker inspect --format='{{.State.Health.Status}}' movie-tracker-app

# Execute command in container
docker exec -it movie-tracker-app sh

# Check container details
docker inspect movie-tracker-app
```

---

## 🛠️ Maintenance

```bash
# Update application
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Clean unused resources
docker system prune

# Clean everything (careful!)
docker system prune -a --volumes

# Remove specific image
docker rmi movie-tracker-system-movie-tracker

# View disk usage
docker system df
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
docker-compose up -d -p 3001:3000
```

### Build Issues
```bash
# Clean build cache
docker builder prune

# Force rebuild without cache
docker-compose build --no-cache

# Remove all and rebuild
docker-compose down -v --rmi all
docker-compose up -d --build
```

### Container Won't Start
```bash
# Check logs for errors
docker logs movie-tracker-app

# Check container status
docker ps -a

# Remove and recreate
docker-compose down
docker-compose up -d
```

### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Or run with sudo (not recommended)
sudo docker-compose up -d
```

---

## 📦 Image Management

```bash
# List images
docker images

# Remove unused images
docker image prune

# Remove specific image
docker rmi movie-tracker:latest

# Tag image
docker tag movie-tracker:latest movie-tracker:v1.0

# Push to registry (if configured)
docker push your-registry/movie-tracker:latest
```

---

## 🌐 Deployment

### Build for Production
```bash
docker build -t movie-tracker:prod .
```

### Push to Docker Hub
```bash
docker login
docker tag movie-tracker:prod username/movie-tracker:latest
docker push username/movie-tracker:latest
```

### Deploy to Cloud
```bash
# Generic deploy command
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_TMDB_API_KEY=your_key \
  --name movie-tracker \
  movie-tracker:prod
```

---

## 📊 Performance Tips

```bash
# Limit container resources
docker run -d \
  --memory="512m" \
  --cpus="0.5" \
  -p 3000:3000 \
  movie-tracker

# Check resource usage
docker stats movie-tracker-app
```

---

## 🔒 Security

```bash
# Run security scan (if using Docker Scout)
docker scout cves movie-tracker:latest

# Check for vulnerabilities
docker scan movie-tracker:latest
```

---

## 💡 Useful Aliases

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# Docker shortcuts
alias dps='docker ps'
alias dpa='docker ps -a'
alias di='docker images'
alias dl='docker logs'
alias dc='docker-compose'
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'
alias dcl='docker-compose logs -f'

# Movie Tracker specific
alias mt-up='cd /path/to/Movie-tracker-system && docker-compose up -d'
alias mt-down='cd /path/to/Movie-tracker-system && docker-compose down'
alias mt-logs='cd /path/to/Movie-tracker-system && docker-compose logs -f'
```

---

## 📱 Environment Variables

```bash
# Set in .env file
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here

# Or pass at runtime
docker run -e NEXT_PUBLIC_TMDB_API_KEY=your_key movie-tracker

# Or use env file
docker run --env-file .env movie-tracker
```

---

## 🎯 Best Practices

1. **Always use .dockerignore** to exclude unnecessary files
2. **Use multi-stage builds** for smaller images (already implemented)
3. **Run as non-root user** (already implemented)
4. **Set resource limits** in production
5. **Use health checks** (already implemented)
6. **Keep images updated** regularly
7. **Use specific tags** instead of latest in production
8. **Monitor logs** and resources
9. **Backup volumes** if using persistent data
10. **Use secrets management** for sensitive data

---

## 📚 Additional Resources

- [Official Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Hub](https://hub.docker.com/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Need Help?** Run `./docker-test.sh` to verify your setup!
