@Library('jenkins-shared-library@main') _

pipeline {
    agent {
        label 'jenkins-agent'
    }

    environment {
        // Set CI=false environment variable
        CI = 'false'
        GIT_REPO_URL = 'https://github.com/adminacute/EnfiniteCBS_UI.git'
        GIT_CREDENTIALS = 'jennkins-to-github'
        KUBECONFIG = 'kubeconfig'
        FILENAME = 'cbs-ui-deploy-service.yaml'
        MICROSERVICE = 'EnfiniteCBS_UI'
        BRANCH = 'devops_main'
        IMAGE_NAME = 'actdocker123/cbs-micro-service'
        DEPLOYMENTNAME = 'cbs-ui-microservice-deployment'
    }

    tools {
        nodejs 'nodejs20'
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

            stage('Extract and Increment Image Tag') {
            steps {
                extractAndIncrementImageTag()
            }
        }

        stage('Build and Push Docker Image') {
            steps {
                buildAndPushDockerImage(env.IMAGE_NAME, env.NEW_TAG)
            }
        }

        stage('Update Deployment Tags') {
            steps {
                updateDeploymentTags(env.FILENAME, env.NEW_TAG, env.IMAGE_NAME)
            }
        }

        stage('Push Deployment File to Git And Copy To K8s Cluster') {
            steps {
                pushDeploymentFileToGit(env.FILENAME, env.NEW_TAG, env.BRANCH, env.GIT_CREDENTIALS, env.GIT_REPO_URL, )
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                deployToKubernetes(env.FILENAME, env.DEPLOYMENTNAME)
            }
        }
    }
}
