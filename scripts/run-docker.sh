#!/bin/bash

# Script para ejecutar SecurePass desde DockerHub
# Uso: ./scripts/run-docker.sh [tag] [puerto]

# Configuración
DOCKERHUB_USERNAME="your-dockerhub-username"  # Cambiar por tu usuario de DockerHub
IMAGE_NAME="securepass"
TAG="${1:-latest}"
PORT="${2:-3000}"

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Ejecutando SecurePass desde DockerHub...${NC}"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker no está instalado. Por favor, instala Docker primero.${NC}"
    exit 1
fi

# Verificar si la imagen ya existe localmente
if ! docker image inspect "${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${TAG}" &> /dev/null; then
    echo -e "${YELLOW}📥 Descargando imagen ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${TAG}...${NC}"
    docker pull "${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${TAG}"
fi

# Detener y eliminar contenedor existente si existe
CONTAINER_NAME="securepass-app"
if docker ps -a | grep -q "${CONTAINER_NAME}"; then
    echo -e "${YELLOW}🛑 Deteniendo contenedor existente...${NC}"
    docker stop "${CONTAINER_NAME}" > /dev/null
    docker rm "${CONTAINER_NAME}" > /dev/null
fi

# Ejecutar el contenedor
echo -e "${YELLOW}▶️ Iniciando SecurePass en el puerto ${PORT}...${NC}"
docker run -d \
    --name "${CONTAINER_NAME}" \
    -p "${PORT}:3000" \
    --restart unless-stopped \
    "${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${TAG}"

# Verificar si el contenedor está en ejecución
if docker ps | grep -q "${CONTAINER_NAME}"; then
    echo -e "${GREEN}✅ SecurePass está ejecutándose correctamente!${NC}"
    echo -e "${GREEN}🌐 Accede a la aplicación en: http://localhost:${PORT}${NC}"
else
    echo -e "${YELLOW}❌ Error al iniciar el contenedor. Revisa los logs:${NC}"
    docker logs "${CONTAINER_NAME}"
fi

# Mostrar información del contenedor
echo -e "${BLUE}📊 Información del contenedor:${NC}"
docker ps -f name="${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"
