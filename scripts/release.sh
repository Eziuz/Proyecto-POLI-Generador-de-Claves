#!/bin/bash

# Script para crear releases con versionado semántico
# Uso: ./scripts/release.sh [major|minor|patch] [mensaje]

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Función de logging
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

# Verificar parámetros
BUMP_TYPE="${1:-patch}"
RELEASE_MESSAGE="${2:-Release version}"

if [[ ! "$BUMP_TYPE" =~ ^(major|minor|patch)$ ]]; then
    error "Tipo de bump inválido. Usa: major, minor, o patch"
fi

# Verificar que estamos en la rama main/master
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" && "$CURRENT_BRANCH" != "master" ]]; then
    warning "No estás en la rama main/master. Rama actual: $CURRENT_BRANCH"
    read -p "¿Continuar? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Verificar que no hay cambios sin commitear
if [[ -n $(git status --porcelain) ]]; then
    error "Hay cambios sin commitear. Haz commit de todos los cambios antes de crear un release."
fi

# Obtener la versión actual
CURRENT_VERSION=$(node -p "require('./package.json').version")
log "Versión actual: $CURRENT_VERSION"

# Calcular nueva versión
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

case $BUMP_TYPE in
    "major")
        MAJOR=$((MAJOR + 1))
        MINOR=0
        PATCH=0
        ;;
    "minor")
        MINOR=$((MINOR + 1))
        PATCH=0
        ;;
    "patch")
        PATCH=$((PATCH + 1))
        ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"
log "Nueva versión: $NEW_VERSION"

# Confirmar el release
echo
warning "¿Crear release $NEW_VERSION? (y/N): "
read -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log "Release cancelado"
    exit 0
fi

# Actualizar package.json
log "Actualizando package.json..."
npm version "$NEW_VERSION" --no-git-tag-version

# Crear commit del release
log "Creando commit del release..."
git add package.json
git commit -m "chore: bump version to $NEW_VERSION"

# Crear tag
log "Creando tag v$NEW_VERSION..."
git tag -a "v$NEW_VERSION" -m "$RELEASE_MESSAGE $NEW_VERSION"

# Push cambios y tags
log "Pushing cambios y tags..."
git push origin "$CURRENT_BRANCH"
git push origin "v$NEW_VERSION"

success "Release $NEW_VERSION creado exitosamente!"
echo
log "Para triggear el build en Jenkins, haz push del tag:"
echo -e "${GREEN}git push origin v$NEW_VERSION${NC}"
echo
log "El pipeline detectará automáticamente el tag y creará la imagen con versión $NEW_VERSION"