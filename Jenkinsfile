pipeline {
    agent any

    environment {
        // Configuración de DockerHub
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USERNAME = "${DOCKERHUB_CREDENTIALS_USR}"
        DOCKERHUB_REPO = 'securepass'

        // Etiquetas de la imagen
        IMAGE_NAME = "${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}"
        VERSION = "${BUILD_NUMBER}"
        GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
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
                    sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"

                    sh """
                        docker push ${IMAGE_NAME}:${VERSION}
                        docker push ${IMAGE_NAME}:latest
                        docker push ${IMAGE_NAME}:${GIT_COMMIT_SHORT}
                    """

                    sh 'docker logout'
                }
            }
        }
    }

    post {
        always {
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
            echo """
            ✅ ¡Imagen publicada exitosamente en DockerHub!

            Para usar esta imagen, ejecuta:
            docker pull ${IMAGE_NAME}:latest
            docker run -d -p 3000:3000 ${IMAGE_NAME}:latest

            También puedes usar una versión específica:
            docker pull ${IMAGE_NAME}:${VERSION}

            O la versión por commit:
            docker pull ${IMAGE_NAME}:${GIT_COMMIT_SHORT}
            """
        }
        failure {
            echo '❌ Error al construir o publicar la imagen'
        }
    }
}
