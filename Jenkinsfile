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
        EMAIL_RECIPIENT = 'jaid.shaikh@acuteinformatics.in,krishna.chauhan@acuteinformatics.in,jayendra.sathwara@acuteinformatics.in,sajid.sachawala@acuteinformatics.in,mayur.bharodiya@acuteinformatics.in,pradeep.suthar@acuteinformatics.in'
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
                sh 'yarn add cross-env'
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
        stage('Trivy Image Scan') {
            steps {
                sh 'trivy image ${IMAGE_NAME}:${NEW_TAG} --format table -o ${MICROSERVICE}.txt '
            }
        }
        stage('Update Manifest and K8s Deployment') {
            steps {
                updateManifestDeploy(env.FILENAME, env.NEW_TAG, env.IMAGE_NAME)
            }
        }
        stage('Update Deployment Tags') {
            steps {
                updateDeploymentTags(env.FILENAME, env.NEW_TAG, env.IMAGE_NAME)
            }
        }

        stage('Push Deployment File to Git') {
            steps {
                pushDeploymentFileToGit(env.FILENAME, env.NEW_TAG, env.BRANCH, env.GIT_CREDENTIALS, env.GIT_REPO_URL, )
            }
        }
    }
    post {
        success {
            notification('SUCCESS', env.EMAIL_RECIPIENT)
        }
        failure {
            notification('FAILURE', env.EMAIL_RECIPIENT)
        }
    }
}
