#!/bin/bash

# Docker Setup Test Script for Movie Tracker System
# This script verifies your Docker installation and environment

set -e

echo "🎬 Movie Tracker System - Docker Setup Test"
echo "==========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Docker
echo "1️⃣  Checking Docker installation..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✅ Docker found: $DOCKER_VERSION${NC}"
else
    echo -e "${RED}❌ Docker not found. Please install Docker first.${NC}"
    echo "   Get Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check Docker Compose
echo ""
echo "2️⃣  Checking Docker Compose..."
if docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version)
    echo -e "${GREEN}✅ Docker Compose found: $COMPOSE_VERSION${NC}"
else
    echo -e "${RED}❌ Docker Compose not found.${NC}"
    exit 1
fi

# Check Docker daemon
echo ""
echo "3️⃣  Checking Docker daemon..."
if docker info &> /dev/null; then
    echo -e "${GREEN}✅ Docker daemon is running${NC}"
else
    echo -e "${RED}❌ Docker daemon is not running. Please start Docker.${NC}"
    exit 1
fi

# Check .env file
echo ""
echo "4️⃣  Checking environment variables..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env file exists${NC}"
    
    if grep -q "NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here" .env; then
        echo -e "${YELLOW}⚠️  Warning: TMDB API key not set. Please update .env file.${NC}"
    elif grep -q "NEXT_PUBLIC_TMDB_API_KEY=" .env; then
        echo -e "${GREEN}✅ TMDB API key is set${NC}"
    else
        echo -e "${YELLOW}⚠️  TMDB API key variable not found in .env${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env
        echo -e "${GREEN}✅ Created .env file. Please update it with your TMDB API key.${NC}"
    else
        echo -e "${RED}❌ .env.local.example not found${NC}"
    fi
fi

# Check port availability
echo ""
echo "5️⃣  Checking port 3000 availability..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use${NC}"
    echo "   You may need to stop the existing service or use a different port"
else
    echo -e "${GREEN}✅ Port 3000 is available${NC}"
fi

# Check Dockerfile
echo ""
echo "6️⃣  Checking Dockerfile..."
if [ -f "Dockerfile" ]; then
    echo -e "${GREEN}✅ Dockerfile found${NC}"
else
    echo -e "${RED}❌ Dockerfile not found${NC}"
    exit 1
fi

# Check docker-compose files
echo ""
echo "7️⃣  Checking docker-compose files..."
if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✅ docker-compose.yml found${NC}"
else
    echo -e "${RED}❌ docker-compose.yml not found${NC}"
fi

if [ -f "docker-compose.dev.yml" ]; then
    echo -e "${GREEN}✅ docker-compose.dev.yml found${NC}"
else
    echo -e "${YELLOW}⚠️  docker-compose.dev.yml not found (optional)${NC}"
fi

# Summary
echo ""
echo "==========================================="
echo -e "${GREEN}🎉 Setup check complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Update .env with your TMDB API key"
echo "  2. Run: docker-compose up -d"
echo "  3. Visit: http://localhost:3000"
echo ""
echo "Quick commands:"
echo "  • Start:   docker-compose up -d"
echo "  • Stop:    docker-compose down"
echo "  • Logs:    docker-compose logs -f"
echo "  • Dev:     docker-compose -f docker-compose.dev.yml up"
echo ""
echo "Or use Makefile:"
echo "  • make help"
echo "  • make up"
echo "  • make dev"
echo ""
