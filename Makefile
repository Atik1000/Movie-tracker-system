.PHONY: help build up down restart logs dev clean test

# Default target
help:
	@echo "Movie Tracker System - Docker Commands"
	@echo ""
	@echo "Available commands:"
	@echo "  make build       - Build the Docker image"
	@echo "  make up          - Start production containers"
	@echo "  make down        - Stop and remove containers"
	@echo "  make restart     - Restart containers"
	@echo "  make logs        - View container logs"
	@echo "  make dev         - Start development mode with hot reload"
	@echo "  make clean       - Remove containers, volumes, and images"
	@echo "  make test        - Run tests in Docker container"
	@echo ""

# Build the Docker image
build:
	@echo "Building Docker image..."
	docker-compose build

# Start production containers
up:
	@echo "Starting production containers..."
	docker-compose up -d
	@echo "Application running at http://localhost:3000"

# Stop and remove containers
down:
	@echo "Stopping containers..."
	docker-compose down

# Restart containers
restart:
	@echo "Restarting containers..."
	docker-compose restart

# View container logs
logs:
	docker-compose logs -f

# Start development mode
dev:
	@echo "Starting development mode..."
	docker-compose -f docker-compose.dev.yml up

# Clean up everything
clean:
	@echo "Cleaning up Docker resources..."
	docker-compose down -v --rmi all --remove-orphans
	@echo "Cleanup complete!"

# Run tests in container
test:
	@echo "Running tests..."
	docker-compose run --rm movie-tracker npm test
