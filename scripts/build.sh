#!/bin/bash

# SecurePass Build Script
# Usage: ./scripts/build.sh [tag]

set -e

IMAGE_NAME="securepass"
TAG="${1:-latest}"
REGISTRY_URL="${REGISTRY_URL:-}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log "🔨 Building Docker image..."

# Build image with build args
docker build \
    -t "$IMAGE_NAME:$TAG" \
    -t "$IMAGE_NAME:latest" \
    --build-arg NODE_ENV=production \
    --build-arg NODE_VERSION=20 \
    . || exit 1

success "Image built successfully: $IMAGE_NAME:$TAG"

# Show image size
log "📊 Image size:"
docker images "$IMAGE_NAME:$TAG" --format "{{.Size}}"

# Push to registry if configured
if [ -n "$REGISTRY_URL" ] && [ "$REGISTRY_URL" != "your-registry.com" ]; then
    log "📤 Pushing to registry..."
    
    docker tag "$IMAGE_NAME:$TAG" "$REGISTRY_URL/$IMAGE_NAME:$TAG"
    docker tag "$IMAGE_NAME:latest" "$REGISTRY_URL/$IMAGE_NAME:latest"
    
    docker push "$REGISTRY_URL/$IMAGE_NAME:$TAG"
    docker push "$REGISTRY_URL/$IMAGE_NAME:latest"
    
    success "Images pushed to registry"
fi

log "📊 Image information:"
docker images "$IMAGE_NAME" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
