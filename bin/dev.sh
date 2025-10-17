#!/bin/bash

# PWA Development Script
# Usage: ./dev.sh [up|restart|logs|ps|down|remove|build|serve|preview]

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' 

# Configuration
APP_NAME="pwa"
ACTION=${1:-ps}
EXTRA_ARGS="${@:2}"

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

start_services() {
    log_info "Starting dev mode..."
    
    docker compose up -d $EXTRA_ARGS
    
    log_info "Dev environment is running"
}

down_services() {
    log_info "Stopping dev services..."
    docker compose down $EXTRA_ARGS
}

remove_services() {
    log_info "Removing dev services..."
    docker compose down -v --rmi local
}

restart_services() {
    log_info "Restarting dev services..."
    docker compose restart $EXTRA_ARGS
}

show_status() {
    docker compose ps $EXTRA_ARGS
}

show_logs() {
    docker compose logs -f $EXTRA_ARGS
}

build_dist() {
    log_info "Building static app..."

    rm -rf dist &&
    
    docker compose run --rm pwa_app pnpm build $EXTRA_ARGS
}


serve_static() {
    log_info "Serving static app..."

    if [ ! -d "dist" ]; then
        log_error "❌ Build required."
        exit 1
    fi
    
    docker compose run --rm --service-ports pwa_app pnpm preview $EXTRA_ARGS
    
    log_info "Application is running"
}

preview_app() {
    build_dist &&

    serve_static
}

log_info "PWA Development Script [up|restart|logs|ps|down|remove|build|serve|preview]"
log_info "Action: $ACTION"
echo ""

case $ACTION in
    up)
        start_services
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
    build)
        build_dist
        ;;
    serve)
        serve_static
        ;;
    preview)
        preview_app
        ;;
esac

log_info "Done!"