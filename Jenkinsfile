@Library('jenkins-shared-library@main') _

pipeline {
    agent {
        label 'jenkins-agent'
    }

    environment {
        // Set CI=false environment variable
        CI = 'false'
    }

    tools {
        nodejs 'nodejs20'
    }

    environment {
        GIT_REPO_URL = 'https://github.com/adminacute/EnfiniteCBS_UI.git'
        GIT_CREDENTIALS = 'jennkins-to-github'
        KUBECONFIG = 'kubeconfig'
        FILENAME = 'cbs-ui-deploy-service.yaml'
        MICROSERVICE = 'EnfiniteCBS_UI'
        BRANCH = 'devops_main'
        IMAGE_NAME = 'actdocker123/cbs-micro-service'
        DEPLOYMENTNAME = 'cbs-ui-microservice-deployment'
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                script {
                    checkoutRepo(env.GIT_REPO_URL, env.GIT_CREDENTIALS, env.BRANCH)
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install --force'
            }
        }

        stage('Build') {
            environment {
                    CI = 'false'
            }

            steps {
                sh 'npm run build'
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'build/**', allowEmptyArchive: true
            }
        }

    // stage('SonarQube - SAST'){
    //     steps {
    //         sonar-scanner -Dsonar.projectKey=Enfinity_UI -Dsonar.sources=. -Dsonar.host.url=http://10.150.17.113:9000 -Dsonar.token=sqp_7d1e1ca6ed168d92b946d73063943309a26d959a
    //     }
    // }
    }
}
