#!/bin/bash

# Script para configurar Yarn 4 en el proyecto
set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Configurando Yarn 4 para el proyecto SecurePass...${NC}"

# Habilitar corepack (viene con Node.js 16+)
echo -e "${YELLOW}Habilitando corepack...${NC}"
corepack enable

# Configurar Yarn 4
echo -e "${YELLOW}Configurando Yarn 4...${NC}"
yarn set version 4.1.0

# Crear directorio .yarn/releases si no existe
mkdir -p .yarn/releases

# Verificar la versión de Yarn
YARN_VERSION=$(yarn --version)
echo -e "${GREEN}Yarn ${YARN_VERSION} configurado correctamente.${NC}"

# Instalar dependencias
echo -e "${YELLOW}Instalando dependencias...${NC}"
yarn install

echo -e "${GREEN}¡Configuración completada!${NC}"
echo -e "Puedes ejecutar ${YELLOW}yarn dev${NC} para iniciar el servidor de desarrollo."
