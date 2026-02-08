#!/bin/bash

# Movie Tracker System - Docker Helper Script
# Quick shortcuts for common Docker operations

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display menu
show_menu() {
    echo ""
    echo -e "${BLUE}🎬 Movie Tracker System - Docker Helper${NC}"
    echo "========================================"
    echo ""
    echo "1) 🚀 Start production (docker-compose up -d)"
    echo "2) 🛠️  Start development mode (hot reload)"
    echo "3) 🛑 Stop containers (docker-compose down)"
    echo "4) 🔄 Restart containers"
    echo "5) 📋 View logs (follow)"
    echo "6) 📊 Check container status"
    echo "7) 💻 Open shell in container"
    echo "8) 🔨 Rebuild and restart"
    echo "9) 🧹 Clean up (remove containers & images)"
    echo "10) 🏥 Health check"
    echo "11) 📦 View resource usage"
    echo "12) ⚙️  Test setup"
    echo "0) ❌ Exit"
    echo ""
}

# Check if Docker is running
check_docker() {
    if ! docker info &> /dev/null; then
        echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
        exit 1
    fi
}

# Main script
main() {
    check_docker
    
    while true; do
        show_menu
        read -p "Select an option: " choice
        echo ""
        
        case $choice in
            1)
                echo -e "${GREEN}🚀 Starting production containers...${NC}"
                docker-compose up -d
                echo -e "${GREEN}✅ Application running at http://localhost:3000${NC}"
                ;;
            2)
                echo -e "${GREEN}🛠️  Starting development mode...${NC}"
                echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
                docker-compose -f docker-compose.dev.yml up
                ;;
            3)
                echo -e "${YELLOW}🛑 Stopping containers...${NC}"
                docker-compose down
                echo -e "${GREEN}✅ Containers stopped${NC}"
                ;;
            4)
                echo -e "${YELLOW}🔄 Restarting containers...${NC}"
                docker-compose restart
                echo -e "${GREEN}✅ Containers restarted${NC}"
                ;;
            5)
                echo -e "${GREEN}📋 Viewing logs (Ctrl+C to exit)...${NC}"
                docker-compose logs -f
                ;;
            6)
                echo -e "${GREEN}📊 Container Status:${NC}"
                docker ps -a | grep movie-tracker || echo "No containers found"
                ;;
            7)
                echo -e "${GREEN}💻 Opening shell in container...${NC}"
                docker exec -it movie-tracker-app sh
                ;;
            8)
                echo -e "${YELLOW}🔨 Rebuilding and restarting...${NC}"
                docker-compose down
                docker-compose build --no-cache
                docker-compose up -d
                echo -e "${GREEN}✅ Rebuild complete${NC}"
                ;;
            9)
                echo -e "${RED}🧹 This will remove all containers, volumes, and images.${NC}"
                read -p "Are you sure? (y/n): " confirm
                if [ "$confirm" = "y" ]; then
                    docker-compose down -v --rmi all --remove-orphans
                    echo -e "${GREEN}✅ Cleanup complete${NC}"
                else
                    echo -e "${YELLOW}Cancelled${NC}"
                fi
                ;;
            10)
                echo -e "${GREEN}🏥 Health Check:${NC}"
                if docker ps --filter "name=movie-tracker-app" --filter "status=running" | grep -q movie-tracker; then
                    HEALTH=$(docker inspect --format='{{.State.Health.Status}}' movie-tracker-app 2>/dev/null || echo "no health check")
                    echo -e "Status: ${GREEN}Running${NC}"
                    echo "Health: $HEALTH"
                    echo ""
                    docker stats --no-stream movie-tracker-app
                else
                    echo -e "${RED}Container is not running${NC}"
                fi
                ;;
            11)
                echo -e "${GREEN}📦 Resource Usage (Ctrl+C to exit):${NC}"
                docker stats movie-tracker-app
                ;;
            12)
                echo -e "${GREEN}⚙️  Running setup test...${NC}"
                if [ -f "./docker-test.sh" ]; then
                    ./docker-test.sh
                else
                    echo -e "${RED}docker-test.sh not found${NC}"
                fi
                ;;
            0)
                echo -e "${GREEN}👋 Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid option. Please try again.${NC}"
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main function
main
