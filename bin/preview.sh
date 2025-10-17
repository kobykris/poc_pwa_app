#!/bin/bash

# PWA Development Preview Script
# Usage: ./preview.sh [run|build|serve]

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' 

# Configuration
APP_NAME="pwa"
ACTION=${1:-run}

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

rebuild_app() {
    log_info "Building preview App..."

    rm -rf dist &&
    
    docker compose run --rm pwa_app pnpm build
}

preview_app() {
    log_info "Deploying in preview mode..."

    if [ ! -d "dist" ]; then
        log_error "❌ Build required."
        exit 1
    fi
    
    docker compose run --rm --service-ports pwa_app pnpm preview
    
    log_info "Preview Application is running"
}

run_app() {
    rebuild_app &&

    preview_app
}

log_info "PWA App Preview Development Script [run|build|serve]"
log_info "Action: $ACTION"
echo ""

case $ACTION in
    build)
        rebuild_app
        ;;
    serve)
        preview_app
        ;;
    run)
        run_app
        ;;
esac

log_info "Done!"