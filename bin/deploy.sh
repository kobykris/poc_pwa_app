#!/bin/bash

# PWA App Deployment Script
# Usage: ./deploy.sh [up|restart|logs|ps|down|remove]

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' 

# Configuration
APP_NAME="pwa"
ACTION=${1:-ps}

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

deploy_prod() {
    log_info "Deploying in production mode..."
    
    # Deploy with docker compose
    docker compose \
        -f docker-compose.prod.yml \
        --env-file ./.env.production \
        up -d --build
    
    log_info "Production environment is running"
}

down_services() {
    log_info "Stopping production services..."
    docker compose \
        -f docker-compose.prod.yml \
        --env-file ./.env.production \
        down
}

remove_services() {
    log_info "Stopping production services..."
    docker compose \
        -f docker-compose.prod.yml \
        --env-file ./.env.production \
        down -v --rmi local
}

restart_services() {
    log_info "Restarting services..."
    docker compose \
        -f docker-compose.prod.yml \
        --env-file ./.env.production \
        restart
}

show_status() {
    docker compose \
        -f docker-compose.prod.yml \
        --env-file ./.env.production \
        ps
}

show_logs() {
    docker compose \
        -f docker-compose.prod.yml \
        --env-file ./.env.production \
        logs -f
}

log_info "PWA App Deployment Script [up|restart|logs|ps|down|remove]"
log_info "Action: $ACTION"
echo ""

case $ACTION in
    up)
        deploy_prod
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    ps)
        show_status
        ;;
    down)
        down_services
        ;;
    remove)
        remove_services
        ;;
esac

log_info "Done!"