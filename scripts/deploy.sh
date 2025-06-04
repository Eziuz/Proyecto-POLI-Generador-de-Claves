#!/bin/bash

# SecurePass Deployment Script
# Usage: ./scripts/deploy.sh [environment]

set -e

# Configuration
IMAGE_NAME="securepass"
REGISTRY_URL="${REGISTRY_URL:-}"
ENVIRONMENT="${1:-production}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Environment-specific configuration
case $ENVIRONMENT in
    "staging")
        CONTAINER_NAME="securepass-staging"
        PORT="3001"
        NODE_ENV="staging"
        ;;
    "production")
        CONTAINER_NAME="securepass-prod"
        PORT="3000"
        NODE_ENV="production"
        ;;
    *)
        error "Invalid environment. Use 'staging' or 'production'"
        ;;
esac

log "🚀 Starting deployment to $ENVIRONMENT..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    error "Docker is not running. Please start Docker and try again."
fi

# Build or pull image
if [ -n "$REGISTRY_URL" ]; then
    log "📥 Pulling latest image from registry..."
    docker pull "$REGISTRY_URL/$IMAGE_NAME:latest" || error "Failed to pull image"
    IMAGE_TAG="$REGISTRY_URL/$IMAGE_NAME:latest"
else
    log "🔨 Building image locally..."
    docker build -t "$IMAGE_NAME:latest" . || error "Failed to build image"
    IMAGE_TAG="$IMAGE_NAME:latest"
fi

# Stop and remove existing container
log "🛑 Stopping existing container..."
if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
    docker stop "$CONTAINER_NAME" || warning "Failed to stop container"
fi

if docker ps -aq -f name="$CONTAINER_NAME" | grep -q .; then
    docker rm "$CONTAINER_NAME" || warning "Failed to remove container"
fi

# Run new container
log "▶️  Starting new container..."
docker run -d \
    --name "$CONTAINER_NAME" \
    -p "$PORT:3000" \
    -e NODE_ENV="$NODE_ENV" \
    -e NEXT_TELEMETRY_DISABLED=1 \
    --restart unless-stopped \
    "$IMAGE_TAG" || error "Failed to start container"

# Health check
log "🏥 Performing health check..."
sleep 15

HEALTH_CHECK_URL="http://localhost:$PORT"
MAX_ATTEMPTS=10
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    if curl -f "$HEALTH_CHECK_URL" > /dev/null 2>&1; then
        success "Health check passed!"
        break
    else
        if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
            error "Health check failed after $MAX_ATTEMPTS attempts"
        fi
        warning "Health check attempt $ATTEMPT failed, retrying in 10 seconds..."
        sleep 10
        ATTEMPT=$((ATTEMPT + 1))
    fi
done

# Cleanup old images
log "🧹 Cleaning up old images..."
docker image prune -f > /dev/null 2>&1 || warning "Failed to cleanup images"

# Show container status
log "📊 Container status:"
docker ps -f name="$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

success "Deployment to $ENVIRONMENT completed successfully!"
log "🌐 Application is available at: $HEALTH_CHECK_URL"
