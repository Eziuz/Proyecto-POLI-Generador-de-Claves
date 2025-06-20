pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_REPO = 'generador-claves'
        IMAGE_NAME = "dennismorato/${DOCKERHUB_REPO}"
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
                    env.GIT_COMMIT_SHORT = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()

                    def gitTag = sh(
                        script: "git describe --tags --exact-match HEAD 2>/dev/null || echo ''",
                        returnStdout: true
                    ).trim()

                    if (gitTag && gitTag.startsWith('v')) {
                        env.VERSION = gitTag.substring(1)
                        env.IS_RELEASE = 'true'
                        echo "🏷️ Found git tag: ${gitTag}"
                    } else {
                        // Método simple usando awk o grep/cut
                        def packageVersion = sh(
                            script: '''
                                if command -v awk >/dev/null 2>&1; then
                                    # Usar awk (más confiable)
                                    awk -F'"' '/"version"/ {print $4; exit}' package.json
                                else
                                    # Fallback con grep y cut
                                    grep '"version"' package.json | head -1 | cut -d'"' -f4
                                fi
                            ''',
                            returnStdout: true
                        ).trim()
                        
                        env.VERSION = "${packageVersion}-build.${BUILD_NUMBER}"
                        env.IS_RELEASE = 'false'
                        echo "📦 Using package.json version: ${packageVersion}"
                    }

                    echo "🏷️ Version determined: ${env.VERSION}"
                    echo "📦 Is release: ${env.IS_RELEASE}"
                    echo "🔗 Git commit: ${env.GIT_COMMIT_SHORT}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "🐳 Building Docker image..."
                    sh """
                        docker build -t ${IMAGE_NAME}:${VERSION} \
                                     -t ${IMAGE_NAME}:latest \
                                     -t ${IMAGE_NAME}:${GIT_COMMIT_SHORT} .
                    """
                    echo "✅ Docker image built successfully"
                }
            }
        }

        stage('Verify Image') {
            steps {
                script {
                    echo "🔍 Verifying Docker image..."
                    sh """
                        echo "Verificando que la imagen existe..."
                        docker images ${IMAGE_NAME}:${VERSION}

                        echo "Verificando estructura de la imagen..."
                        docker inspect ${IMAGE_NAME}:${VERSION} > /dev/null

                        echo "Verificando configuración de la imagen..."
                        docker inspect ${IMAGE_NAME}:${VERSION} | grep -E '"User"|"Entrypoint"|"Cmd"|"WorkingDir"' || true

                        echo "✅ Imagen verificada exitosamente"
                    """
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                script {
                    echo "📤 Pushing to DockerHub..."
                    
                    sh "echo '${DOCKERHUB_CREDENTIALS_PSW}' | docker login -u '${DOCKERHUB_CREDENTIALS_USR}' --password-stdin"

                    sh """
                        docker push ${IMAGE_NAME}:${VERSION}
                        docker push ${IMAGE_NAME}:${GIT_COMMIT_SHORT}
                    """

                    if (env.IS_RELEASE == 'true') {
                        sh "docker push ${IMAGE_NAME}:latest"
                        echo "✅ Released version ${VERSION} as latest"
                    } else {
                        echo "⚠️ Development build - not updating 'latest' tag"
                    }

                    sh 'docker logout'
                    echo "✅ Successfully pushed to DockerHub"
                }
            }
        }
    }

    post {
        always {
            script {
                echo "🧹 Cleaning up..."
                
                if (env.VERSION && env.GIT_COMMIT_SHORT) {
                    sh """
                        CONTAINERS=\$(docker ps -aq --filter ancestor=${IMAGE_NAME} 2>/dev/null || echo "")
                        if [ ! -z "\$CONTAINERS" ]; then
                            echo "Limpiando contenedores: \$CONTAINERS"
                            docker stop \$CONTAINERS || true
                            docker rm \$CONTAINERS || true
                        fi

                        docker rmi ${IMAGE_NAME}:${VERSION} || true
                        docker rmi ${IMAGE_NAME}:latest || true
                        docker rmi ${IMAGE_NAME}:${GIT_COMMIT_SHORT} || true
                        docker image prune -f || true
                    """
                }
            }
            cleanWs()
        }
        
        success {
            script {
                if (env.IS_RELEASE == 'true') {
                    echo """
                    🎉 ¡Release ${env.VERSION} publicado exitosamente!

                    Para usar esta versión:
                    docker pull ${IMAGE_NAME}:${env.VERSION}
                    docker pull ${IMAGE_NAME}:latest
                    docker run -d -p 3000:3000 ${IMAGE_NAME}:${env.VERSION}
                    """
                } else {
                    echo """
                    ✅ ¡Build de desarrollo completado!

                    Para usar esta versión:
                    docker pull ${IMAGE_NAME}:${env.VERSION}
                    docker run -d -p 3000:3000 ${IMAGE_NAME}:${env.VERSION}

                    También disponible por commit:
                    docker pull ${IMAGE_NAME}:${env.GIT_COMMIT_SHORT}
                    """
                }
            }
        }
        
        failure {
            echo '❌ Error al construir o publicar la imagen'
            script {
                sh '''
                    echo "=== INFORMACIÓN DE DEBUG ==="
                    echo "Workspace: $(pwd)"
                    echo "Contenido del package.json:"
                    cat package.json | head -20 || true
                    echo "Herramientas disponibles:"
                    command -v awk && echo "✅ awk disponible" || echo "❌ awk no disponible"
                    command -v grep && echo "✅ grep disponible" || echo "❌ grep no disponible"
                    command -v cut && echo "✅ cut disponible" || echo "❌ cut no disponible"
                    echo "Prueba de extracción de versión:"
                    awk -F'"' '/"version"/ {print $4; exit}' package.json 2>/dev/null || grep '"version"' package.json | head -1 | cut -d'"' -f4 || echo "Error extrayendo versión"
                '''
            }
        }
    }
}
