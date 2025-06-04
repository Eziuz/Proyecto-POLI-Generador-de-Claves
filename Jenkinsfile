pipeline {
    agent any
    
    environment {
        // Configuración de DockerHub
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // ID de las credenciales en Jenkins
        DOCKERHUB_USERNAME = "${DOCKERHUB_CREDENTIALS_USR}"
        DOCKERHUB_REPO = "securepass" // Nombre del repositorio en DockerHub
        
        // Etiquetas de la imagen
        IMAGE_NAME = "${DOCKERHUB_USERNAME}/${DOCKERHUB_REPO}"
        VERSION = "${BUILD_NUMBER}"
        GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
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
                    // Construir la imagen Docker
                    sh """
                        docker build -t ${IMAGE_NAME}:${VERSION} \
                                     -t ${IMAGE_NAME}:latest \
                                     -t ${IMAGE_NAME}:${GIT_COMMIT_SHORT} .
                    """
                }
            }
        }
        
        stage('Test Image') {
            steps {
                script {
                    // Ejecutar la imagen para verificar que funciona correctamente
                    sh """
                        docker run -d --name test-container -p 3000:3000 ${IMAGE_NAME}:${VERSION}
                        sleep 10
                        curl -s http://localhost:3000 > /dev/null || exit 1
                        docker stop test-container
                        docker rm test-container
                    """
                    
                    // Opcional: Escaneo de seguridad
                    sh """
                        if command -v trivy &> /dev/null; then
                            trivy image --exit-code 0 --severity HIGH,CRITICAL ${IMAGE_NAME}:${VERSION}
                        else
                            echo "Trivy no instalado, omitiendo escaneo de seguridad"
                        fi
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
                        docker push ${IMAGE_NAME}:latest
                        docker push ${IMAGE_NAME}:${GIT_COMMIT_SHORT}
                    """
                    
                    // Cerrar sesión de DockerHub
                    sh "docker logout"
                }
            }
        }
    }
    
    post {
        always {
            // Limpiar workspace y eliminar imágenes locales
            cleanWs()
            sh """
                docker rmi ${IMAGE_NAME}:${VERSION} || true
                docker rmi ${IMAGE_NAME}:latest || true
                docker rmi ${IMAGE_NAME}:${GIT_COMMIT_SHORT} || true
                docker image prune -f
            """
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
            echo "❌ Error al construir o publicar la imagen"
        }
    }
}
