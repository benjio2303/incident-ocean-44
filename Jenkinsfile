
pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "yourusername/cy-incident-management"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    // Check if Docker Hub credentials exist
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_HUB_USER', passwordVariable: 'DOCKER_HUB_PASS')]) {
                        sh "docker login -u ${DOCKER_HUB_USER} -p ${DOCKER_HUB_PASS}"
                        sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                        sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'chmod +x ./scripts/deploy-jenkins.sh'
                sh './scripts/deploy-jenkins.sh'
            }
        }
    }
    
    post {
        always {
            node {
                sh 'docker logout || true'
            }
        }
        success {
            node {
                echo 'Build and deployment completed successfully!'
            }
        }
        failure {
            node {
                echo 'Build or deployment failed. Check logs for details.'
            }
        }
    }
}
