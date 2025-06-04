pipeline {
    agent any

    environment {
        // Configuración de DockerHub
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USERNAME = "${DOCKERHUB_CREDENTIALS_USR}"
        DOCKERHUB_REPO = 'securepass'

        // Etiquetas de la imagen con versionado semántico
        IMAGE_NAME = "${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}"
        GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Determine Version') {
            steps {
                script {
                    // Intentar obtener la versión desde Git tags
                    def gitTag = sh(
                        script: "git describe --tags --exact-match HEAD 2>/dev/null || echo ''",
                        returnStdout: true
                    ).trim()

                    if (gitTag && gitTag.startsWith('v')) {
                        // Si hay un tag que empiece con 'v', usarlo como versión
                        env.VERSION = gitTag.substring(1) // Remover la 'v' del inicio
                        env.IS_RELEASE = 'true'
                    } else {
                        // Si no hay tag, usar versión desde package.json + build number
                        def packageVersion = sh(
                            script: "node -p \"require('./package.json').version\"",
                            returnStdout: true
                        ).trim()
                        env.VERSION = "${packageVersion}-build.${BUILD_NUMBER}"
                        env.IS_RELEASE = 'false'
                    }

                    echo "🏷️ Version determined: ${env.VERSION}"
                    echo "📦 Is release: ${env.IS_RELEASE}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Construir la imagen Docker con versionado semántico
                    sh """
                        docker build -t ${IMAGE_NAME}:${VERSION} \
                                     -t ${IMAGE_NAME}:latest \
                                     -t ${IMAGE_NAME}:${GIT_COMMIT_SHORT} .
                    """
                }
            }
        }

        stage('Verify Image') {
            steps {
                script {
                    sh """
                        echo "Verificando que la imagen existe..."
                        docker images ${IMAGE_NAME}:${VERSION}

                        echo "Verificando estructura de la imagen..."
                        docker inspect ${IMAGE_NAME}:${VERSION} > /dev/null

                        echo "Verificando configuración de la imagen..."
                        docker inspect ${IMAGE_NAME}:${VERSION} | grep -E '"User"|"Entrypoint"|"Cmd"|"WorkingDir"' || true

                        echo "Imagen verificada exitosamente"
                    """
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    // Iniciar sesión en DockerHub
                    sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"

                    // Publicar las imágenes en DockerHub
                    sh """
                        docker push ${IMAGE_NAME}:${VERSION}
                        docker push ${IMAGE_NAME}:${GIT_COMMIT_SHORT}
                    """

                    // Solo pushear 'latest' si es un release oficial
                    if (env.IS_RELEASE == 'true') {
                        sh "docker push ${IMAGE_NAME}:latest"
                        echo "✅ Released version ${VERSION} as latest"
                    } else {
                        echo "⚠️ Development build - not updating 'latest' tag"
                    }

                    // Cerrar sesión de DockerHub
                    sh 'docker logout'
                }
            }
        }
    }

    post {
        always {
            // Limpiar workspace y eliminar imágenes locales
            cleanWs()
            script {
                sh """
                    # Obtener contenedores que usan nuestras imágenes
                    CONTAINERS=\$(docker ps -aq --filter ancestor=${IMAGE_NAME} 2>/dev/null || echo "")
                    if [ ! -z "\$CONTAINERS" ]; then
                        echo "Limpiando contenedores: \$CONTAINERS"
                        docker stop \$CONTAINERS || true
                        docker rm \$CONTAINERS || true
                    else
                        echo "No hay contenedores que limpiar"
                    fi

                    # Eliminar las imágenes
                    docker rmi ${IMAGE_NAME}:${VERSION} || true
                    docker rmi ${IMAGE_NAME}:latest || true
                    docker rmi ${IMAGE_NAME}:${GIT_COMMIT_SHORT} || true
                    docker image prune -f || true
                """
            }
        }
        success {
            script {
                if (env.IS_RELEASE == 'true') {
                    echo """
                    🎉 ¡Release ${VERSION} publicado exitosamente!

                    Para usar esta versión:
                    docker pull ${IMAGE_NAME}:${VERSION}
                    docker pull ${IMAGE_NAME}:latest
                    docker run -d -p 3000:3000 ${IMAGE_NAME}:${VERSION}
                    """
                } else {
                    echo """
                    ✅ ¡Build de desarrollo completado!

                    Para usar esta versión:
                    docker pull ${IMAGE_NAME}:${VERSION}
                    docker run -d -p 3000:3000 ${IMAGE_NAME}:${VERSION}

                    También disponible por commit:
                    docker pull ${IMAGE_NAME}:${GIT_COMMIT_SHORT}
                    """
                }
            }
        }
        failure {
            echo '❌ Error al construir o publicar la imagen'
        }
    }
}
