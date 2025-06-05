# SecurePass - Generador de Contraseñas Seguras

![SecurePass Logo](https://securepass.vercel.app/favicon.png)

Una aplicación web moderna para generar contraseñas seguras y evaluar su fortaleza en tiempo real.

[![Docker Image](https://img.shields.io/docker/pulls/your-dockerhub-username/securepass?style=for-the-badge&logo=docker&logoColor=white)](https://hub.docker.com/r/your-dockerhub-username/securepass)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)

## 🐳 Uso con Docker

La forma más sencilla de ejecutar SecurePass es usando nuestra imagen oficial de Docker:

\`\`\`bash
docker run -d -p 3000:3000 your-dockerhub-username/securepass:latest
\`\`\`

Luego, abre tu navegador en `http://localhost:3000`.

### Etiquetas disponibles

- `latest`: La versión más reciente
- `X.Y.Z`: Versiones específicas (semver)
- `<commit-hash>`: Versión específica por commit de Git

### Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto en el que se ejecuta la aplicación | `3000` |
| `NODE_ENV` | Entorno de ejecución | `production` |

### Docker Compose

\`\`\`yaml
version: '3.8'

services:
  securepass:
    image: your-dockerhub-username/securepass:latest
    ports:
      - "3000:3000"
    restart: unless-stopped
\`\`\`

## 🚀 Características

- ✅ Generador de contraseñas con opciones personalizables
- ✅ Validador de fortaleza en tiempo real
- ✅ Historial de contraseñas generadas
- ✅ Soporte multiidioma (Español/Inglés)
- ✅ Modo oscuro/claro
- ✅ Diseño responsive para móviles y escritorio
- ✅ Interfaz moderna con efectos visuales

## 🛠️ Desarrollo local

### Requisitos previos

- Node.js 20 LTS
- Yarn 4.x

### Instalación

\`\`\`bash
# Clonar el repositorio
git clone https://github.com/your-username/securepass.git
cd securepass

# Instalar dependencias
yarn install

# Iniciar servidor de desarrollo
yarn dev
\`\`\`

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
\`\`\`

Ahora, vamos a crear un archivo de configuración para GitHub Actions como alternativa a Jenkins (es más fácil de configurar para muchos usuarios):
